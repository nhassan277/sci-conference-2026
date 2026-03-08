import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { generateToken, verifyToken, AuthRequest } from "./auth.js";
import { ensureOwnerIsSuperAdmin, getAdminByOpenId } from "./admin-management.js";
import { notificationEmitter, NotificationEvent } from "./notification-emitter.js";
import { initializeDigestScheduler } from "./digest-scheduler.js";
import { initializeSurveyScheduler } from "./survey-scheduler.js";
import { initReminderScheduler } from "./reminder-scheduler.js";
import { setupVite, serveStatic } from "./vite.js";
import { generateSchedulePDF } from "./schedule-pdf.js";

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

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
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

      // Decode redirectUri from state (base64 encoded)
      const redirectUri = state 
        ? Buffer.from(state as string, 'base64').toString('utf-8') 
        : `${req.protocol}://${req.get('host')}/api/oauth/callback`;

      console.log("[OAuth] Exchanging code for token, redirectUri:", redirectUri);

      const tokenResponse = await fetch(`${oauthServerUrl}/webdev.v1.WebDevAuthPublicService/ExchangeToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: appId,
          code,
          grantType: "authorization_code",
          redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.code === 'unauthenticated' || tokenData.error) {
        console.error("Token exchange error:", tokenData);
        throw new Error(`Failed to exchange code for token: ${tokenData.message || tokenData.error_description || tokenData.error}`);
      }

      const accessToken = tokenData.accessToken || tokenData.access_token;
      if (!accessToken) {
        console.error("No access token in response:", tokenData);
        throw new Error("No access token received");
      }

      console.log("[OAuth] Token received, fetching user info...");

      // Get user info
      const userResponse = await fetch(`${oauthServerUrl}/webdev.v1.WebDevAuthPublicService/GetUserInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const userData = await userResponse.json();
      if (userData.code === 'unauthenticated' || !userData.openId) {
        console.error("Get user info error:", userData);
        throw new Error(`Failed to get user info: ${userData.message || 'unknown error'}`);
      }

      console.log("[OAuth] User info received for:", userData.name || userData.openId);

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

  // Schedule PDF export endpoint (public)
  app.get("/api/schedule/export-pdf", (req, res) => {
    try {
      generateSchedulePDF(res);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
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
    res.setHeader("X-Accel-Buffering", "no");

    res.write(`data: ${JSON.stringify({ type: "connected", message: "Connected to notification stream" })}\n\n`);

    const notificationListener = (notification: NotificationEvent) => {
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    };

    notificationEmitter.on("notification", notificationListener);

    const keepaliveInterval = setInterval(() => {
      res.write(`: keepalive\n\n`);
    }, 30000);

    req.on("close", () => {
      clearInterval(keepaliveInterval);
      notificationEmitter.off("notification", notificationListener);
    });
  });

  // tRPC middleware with auth context
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }: { req: AuthRequest }) => {
        const token = req.cookies?.auth_token;
        const user = token ? verifyToken(token) : undefined;
        return { user: user ?? undefined, req };
      },
    })
  );

  // Setup Vite in development or serve static files in production
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
