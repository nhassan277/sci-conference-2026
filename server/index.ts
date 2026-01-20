import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { generateToken, verifyToken, authMiddleware, AuthRequest } from "./auth.js";
import { ensureOwnerIsSuperAdmin, getAdminByOpenId } from "./admin-management.js";
import { notificationEmitter, NotificationEvent } from "./notification-emitter.js";
import { initializeDigestScheduler } from "./digest-scheduler.js";
import { initializeSurveyScheduler } from "./survey-scheduler.js";
import { initReminderScheduler } from "./reminder-scheduler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Ensure owner is always super admin
  await ensureOwnerIsSuperAdmin();
  
  // Initialize email digest scheduler
  initializeDigestScheduler();
  
  // Initialize survey scheduler
  initializeSurveyScheduler();
  
  // Initialize reminder scheduler
  initReminderScheduler();

  const app = express();
  const server = createServer(app);

  // Stripe webhook endpoint MUST be before express.json() to preserve raw body
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const { handleStripeWebhook } = await import("./webhook.js");
    await handleStripeWebhook(req, res);
  });

  app.use(express.json());
  app.use(cookieParser());

  // OAuth callback endpoint
  app.get("/api/oauth/callback", async (req, res) => {
    try {
      const { code, state } = req.query;

      if (!code) {
        return res.status(400).send("Missing authorization code");
      }

      // Exchange code for user info
      const oauthServerUrl = process.env.OAUTH_SERVER_URL;
      const appId = process.env.VITE_APP_ID;

      const tokenResponse = await fetch(`${oauthServerUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          code,
          grantType: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await tokenResponse.json();
      const { accessToken } = tokenData;

      // Get user info
      const userResponse = await fetch(`${oauthServerUrl}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user info");
      }

      const userData = await userResponse.json();

      // Generate JWT
      const token = generateToken({
        openId: userData.openId,
        name: userData.name,
        email: userData.email,
      });

      // Set cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
      });

      // Redirect to admin dashboard
      res.redirect("/admin");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("auth_token");
    res.json({ success: true });
  });

  // Get current user endpoint
  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json(user);
  });

  // SSE endpoint for real-time notifications (admin only)
  app.get("/api/notifications/stream", async (req, res) => {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Check if user is admin
    const admin = await getAdminByOpenId(user.openId);
    if (!admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: "connected", message: "Connected to notification stream" })}\n\n`);

    // Create listener for notifications
    const notificationListener = (notification: NotificationEvent) => {
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    };

    notificationEmitter.on("notification", notificationListener);

    // Send keepalive every 30 seconds
    const keepaliveInterval = setInterval(() => {
      res.write(`: keepalive\n\n`);
    }, 30000);

    // Cleanup on connection close
    req.on("close", () => {
      clearInterval(keepaliveInterval);
      notificationEmitter.off("notification", notificationListener);
      console.log(`[SSE] Admin ${admin.email} disconnected from notification stream`);
    });

    console.log(`[SSE] Admin ${admin.email} connected to notification stream`);
  });

  // tRPC middleware with auth context
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }: { req: AuthRequest }) => {
        const token = req.cookies?.auth_token;
        const user = token ? verifyToken(token) : null;
        return { user, req };
      },
    })
  );

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
