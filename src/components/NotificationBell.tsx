import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AppNotification,
  ensureUserInviteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  onNotificationsChanged,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

export function NotificationBell({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    ensureUserInviteNotification();
    setNotifications(getNotifications());

    return onNotificationsChanged(() => {
      ensureUserInviteNotification();
      setNotifications(getNotifications());
    });
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleClickNotification = (notification: AppNotification) => {
    markNotificationRead(notification.id);
    setOpen(false);
    navigate(notification.link);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-md border bg-card p-2 text-foreground hover:bg-muted"
        aria-label="open notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-xl border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-card-foreground">Notifications</p>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead()}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="rounded-lg border p-3 text-xs text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleClickNotification(notification)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition hover:bg-muted",
                    !notification.read && "border-primary/40 bg-primary/5"
                  )}
                >
                  <p className="text-sm text-card-foreground">{notification.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
