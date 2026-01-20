import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface NotificationEvent {
  id: string;
  type: "registration" | "checkin" | "vip_change" | "admin_action" | "system_alert" | "error";
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  severity?: "info" | "success" | "warning" | "error";
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Create SSE connection
    const eventSource = new EventSource("/api/notifications/stream", {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("[SSE] Connected to notification stream");
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Skip connection message
        if (data.type === "connected") {
          return;
        }

        const notification: NotificationEvent = data;

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev].slice(0, 100)); // Keep last 100

        // Show toast notification
        if (notification.severity === "error") {
          toast.error(notification.title, { description: notification.message });
        } else if (notification.severity === "success") {
          toast.success(notification.title, { description: notification.message });
        } else if (notification.severity === "warning") {
          toast.warning(notification.title, { description: notification.message });
        } else {
          toast.info(notification.title, { description: notification.message });
        }

        console.log("[SSE] Received notification:", notification);
      } catch (error) {
        console.error("[SSE] Failed to parse notification:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("[SSE] Connection error:", error);
      setIsConnected(false);
      
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log("[SSE] Attempting to reconnect...");
          eventSource.close();
          // The component will remount and create a new connection
        }
      }, 5000);
    };

    // Cleanup on unmount
    return () => {
      console.log("[SSE] Disconnecting from notification stream");
      eventSource.close();
    };
  }, [toast]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    isConnected,
    clearNotifications,
    removeNotification,
  };
}
