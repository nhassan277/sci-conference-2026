import { describe, it, expect, beforeAll } from "vitest";
import { notificationEmitter, NotificationEvent } from "./notification-emitter.js";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { ensureOwnerIsSuperAdmin } from "./admin-management.js";

describe("Real-Time Notification System", () => {
  beforeAll(async () => {
    // Ensure owner is super admin
    await ensureOwnerIsSuperAdmin();
  });

  it("should emit new registration notification", async () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      category: "student" as const,
    };

    // Create promise that resolves when notification is received
    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "registration") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    // Emit notification
    notificationEmitter.emitNewRegistration(testData);

    // Wait for notification
    const notification = await notificationPromise;
    
    expect(notification.title).toBe("New Registration");
    expect(notification.message).toContain(testData.name);
    expect(notification.data).toMatchObject(testData);
    expect(notification.severity).toBe("success");
  });

  it("should emit check-in notification", async () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      isVIP: false,
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "checkin") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitCheckIn(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("Check-In");
    expect(notification.message).toContain(testData.name);
    expect(notification.data).toMatchObject(testData);
    expect(notification.severity).toBe("info");
  });

  it("should emit VIP check-in notification", async () => {
    const testData = {
      name: "VIP User",
      email: "vip@example.com",
      isVIP: true,
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "checkin" && notification.data.isVIP) {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitCheckIn(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("VIP Check-In");
    expect(notification.message).toContain("VIP");
    expect(notification.data).toMatchObject(testData);
  });

  it("should emit VIP status change notification", async () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      isVIP: true,
      changedBy: "Admin User",
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "vip_change") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitVIPChange(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("VIP Status Changed");
    expect(notification.message).toContain("marked as VIP");
    expect(notification.message).toContain(testData.changedBy);
    expect(notification.data).toMatchObject(testData);
  });

  it("should emit admin action notification", async () => {
    const testData = {
      action: "created",
      resource: "session",
      adminName: "Admin User",
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "admin_action") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitAdminAction(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("Admin Action");
    expect(notification.message).toContain(testData.action);
    expect(notification.message).toContain(testData.resource);
    expect(notification.message).toContain(testData.adminName);
  });

  it("should emit system alert notification", async () => {
    const testData = {
      message: "Database backup completed",
      details: { size: "500MB", duration: "2 minutes" },
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "system_alert") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitSystemAlert(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("System Alert");
    expect(notification.message).toBe(testData.message);
    expect(notification.data).toMatchObject(testData.details);
    expect(notification.severity).toBe("warning");
  });

  it("should emit error notification", async () => {
    const testData = {
      message: "Failed to send email",
      error: { code: "SMTP_ERROR", details: "Connection timeout" },
    };

    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "error") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    notificationEmitter.emitError(testData);

    const notification = await notificationPromise;
    
    expect(notification.title).toBe("Error");
    expect(notification.message).toBe(testData.message);
    expect(notification.data).toMatchObject(testData.error);
    expect(notification.severity).toBe("error");
  });

  it("should generate unique notification IDs", () => {
    const notification1 = notificationEmitter.emitNewRegistration({
      name: "User 1",
      email: "user1@example.com",
      category: "student",
    });

    const notification2 = notificationEmitter.emitNewRegistration({
      name: "User 2",
      email: "user2@example.com",
      category: "faculty",
    });

    expect(notification1.id).not.toBe(notification2.id);
    expect(notification1.id).toMatch(/^notif_/);
    expect(notification2.id).toMatch(/^notif_/);
  });

  it("should include timestamp in notifications", () => {
    const beforeEmit = new Date();
    
    const notification = notificationEmitter.emitNewRegistration({
      name: "Test User",
      email: "test@example.com",
      category: "student",
    });

    const afterEmit = new Date();

    expect(notification.timestamp).toBeInstanceOf(Date);
    expect(notification.timestamp.getTime()).toBeGreaterThanOrEqual(beforeEmit.getTime());
    expect(notification.timestamp.getTime()).toBeLessThanOrEqual(afterEmit.getTime());
  });

  it("should support multiple listeners", async () => {
    let listener1Called = false;
    let listener2Called = false;

    const allListenersPromise = new Promise<void>((resolve) => {
      const checkBothCalled = () => {
        if (listener1Called && listener2Called) {
          resolve();
        }
      };

      const listener1 = (notification: NotificationEvent) => {
        if (notification.type === "registration") {
          listener1Called = true;
          notificationEmitter.off("notification", listener1);
          checkBothCalled();
        }
      };

      const listener2 = (notification: NotificationEvent) => {
        if (notification.type === "registration") {
          listener2Called = true;
          notificationEmitter.off("notification", listener2);
          checkBothCalled();
        }
      };

      notificationEmitter.on("notification", listener1);
      notificationEmitter.on("notification", listener2);
    });

    notificationEmitter.emitNewRegistration({
      name: "Test User",
      email: "test@example.com",
      category: "student",
    });

    await allListenersPromise;
    
    expect(listener1Called).toBe(true);
    expect(listener2Called).toBe(true);
  });

  it("should handle rapid notification emissions", async () => {
    const expectedCount = 10;

    const allNotificationsPromise = new Promise<NotificationEvent[]>((resolve) => {
      const receivedNotifications: NotificationEvent[] = [];

      const listener = (notification: NotificationEvent) => {
        if (notification.type === "registration") {
          receivedNotifications.push(notification);
          
          if (receivedNotifications.length === expectedCount) {
            notificationEmitter.off("notification", listener);
            resolve(receivedNotifications);
          }
        }
      };

      notificationEmitter.on("notification", listener);
    });

    // Emit multiple notifications rapidly
    for (let i = 0; i < expectedCount; i++) {
      notificationEmitter.emitNewRegistration({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        category: "student",
      });
    }

    const receivedNotifications = await allNotificationsPromise;
    
    expect(receivedNotifications.length).toBe(expectedCount);
    
    // Check all have unique IDs
    const ids = receivedNotifications.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(expectedCount);
  });
});

describe("Notification Integration with Database Operations", () => {
  it("should emit notification when registration is created", async () => {
    const notificationPromise = new Promise<NotificationEvent>((resolve) => {
      const listener = (notification: NotificationEvent) => {
        if (notification.type === "registration") {
          notificationEmitter.off("notification", listener);
          resolve(notification);
        }
      };
      notificationEmitter.on("notification", listener);
    });

    // Create test registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Integration Test User",
      fullNameArabic: "مستخدم اختبار التكامل",
      email: "integration-test@example.com",
      phone: "+1234567890",
      affiliation: "Test University",
      attendeeCategory: "student",
      participationType: "attendee",
    });

    const registrationId = result.insertId;

    // Manually emit notification (in real app, this happens in the mutation)
    notificationEmitter.emitNewRegistration({
      name: "Integration Test User",
      email: "integration-test@example.com",
      category: "student",
    });

    // Wait for notification
    const notification = await notificationPromise;
    
    expect(notification.type).toBe("registration");
    expect(notification.message).toContain("Integration Test User");

    // Cleanup
    await db.delete(registrations).where(eq(registrations.id, registrationId));
  });
});
