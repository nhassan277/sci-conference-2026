import { EventEmitter } from "events";

export interface NotificationEvent {
  id: string;
  type: "registration" | "checkin" | "vip_change" | "admin_action" | "system_alert" | "error";
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  severity?: "info" | "success" | "warning" | "error";
}

class NotificationEmitter extends EventEmitter {
  private static instance: NotificationEmitter;

  private constructor() {
    super();
    this.setMaxListeners(100); // Allow many concurrent admin connections
  }

  public static getInstance(): NotificationEmitter {
    if (!NotificationEmitter.instance) {
      NotificationEmitter.instance = new NotificationEmitter();
    }
    return NotificationEmitter.instance;
  }

  public emitNotification(event: Omit<NotificationEvent, "id" | "timestamp">) {
    const notification: NotificationEvent = {
      ...event,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.emit("notification", notification);
    console.log(`[Notification] ${notification.type}: ${notification.title}`);
    
    return notification;
  }

  public emitNewRegistration(data: { name: string; email: string; category: string }) {
    return this.emitNotification({
      type: "registration",
      title: "New Registration",
      message: `${data.name} (${data.category}) has registered`,
      data,
      severity: "success",
    });
  }

  public emitCheckIn(data: { name: string; email: string; isVIP: boolean }) {
    return this.emitNotification({
      type: "checkin",
      title: data.isVIP ? "VIP Check-In" : "Check-In",
      message: `${data.name} has checked in${data.isVIP ? " (VIP)" : ""}`,
      data,
      severity: "info",
    });
  }

  public emitVIPChange(data: { name: string; email: string; isVIP: boolean; changedBy: string }) {
    return this.emitNotification({
      type: "vip_change",
      title: "VIP Status Changed",
      message: `${data.name} ${data.isVIP ? "marked as VIP" : "VIP status removed"} by ${data.changedBy}`,
      data,
      severity: "info",
    });
  }

  public emitAdminAction(data: { action: string; resource: string; adminName: string }) {
    return this.emitNotification({
      type: "admin_action",
      title: "Admin Action",
      message: `${data.adminName} ${data.action} ${data.resource}`,
      data,
      severity: "info",
    });
  }

  public emitSystemAlert(data: { message: string; details?: any }) {
    return this.emitNotification({
      type: "system_alert",
      title: "System Alert",
      message: data.message,
      data: data.details,
      severity: "warning",
    });
  }

  public emitError(data: { message: string; error?: any }) {
    return this.emitNotification({
      type: "error",
      title: "Error",
      message: data.message,
      data: data.error,
      severity: "error",
    });
  }
}

export const notificationEmitter = NotificationEmitter.getInstance();
