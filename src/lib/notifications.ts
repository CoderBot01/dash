export type NotificationType = "invite" | "invite_accepted" | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

type UserRole = "admin" | "user";
type InviteStatus = "pending" | "accepted";

const PROFILE_KEY = "leadpulse_profile";
const NOTIFICATIONS_KEY = "leadpulse_notifications";
const INVITE_STATUS_KEY = "leadpulse_current_user_invite_status";
const EVENT_NAME = "leadpulse:notifications-changed";

const defaultProfile = {
  role: "User",
  email: "praveenkumarellai555@gmail.com",
};

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getCurrentUser = () => {
  const profile = safeJsonParse<{ role?: string; email?: string }>(
    localStorage.getItem(PROFILE_KEY),
    defaultProfile
  );

  const role = (profile.role || "User").toLowerCase().includes("admin") ? "admin" : "user";
  const email = (profile.email || defaultProfile.email).toLowerCase();

  return { role: role as UserRole, email };
};

export const getCurrentUserInviteStatus = (): InviteStatus => {
  const raw = localStorage.getItem(INVITE_STATUS_KEY);
  if (raw === "accepted") return "accepted";
  return "pending";
};

export const setCurrentUserInviteStatus = (status: InviteStatus) => {
  localStorage.setItem(INVITE_STATUS_KEY, status);
};

export const getNotifications = (): AppNotification[] => {
  const notifications = safeJsonParse<AppNotification[]>(
    localStorage.getItem(NOTIFICATIONS_KEY),
    []
  );

  return notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const saveNotifications = (notifications: AppNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

const emitChange = () => {
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const onNotificationsChanged = (handler: () => void) => {
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
};

export const addNotification = (payload: Omit<AppNotification, "id" | "createdAt" | "read">) => {
  const current = getNotifications();
  const notification: AppNotification = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    read: false,
    ...payload,
  };
  saveNotifications([notification, ...current]);
  emitChange();
};

export const markNotificationRead = (id: string) => {
  const next = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(next);
  emitChange();
};

export const markAllNotificationsRead = () => {
  const next = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(next);
  emitChange();
};

export const ensureUserInviteNotification = () => {
  const currentUser = getCurrentUser();
  if (currentUser.role !== "user") return;
  if (getCurrentUserInviteStatus() !== "pending") return;

  const hasInviteNotification = getNotifications().some(
    (n) => n.type === "invite" && !n.read
  );
  if (hasInviteNotification) return;

  addNotification({
    type: "invite",
    message: "You are invited to an organization. Go to Settings to accept.",
    link: "/settings",
  });
};

export const notifyCurrentUserInvite = (email: string) => {
  const currentUser = getCurrentUser();
  if (currentUser.email !== email.toLowerCase()) return;
  if (currentUser.role === "admin") return;

  setCurrentUserInviteStatus("pending");
  addNotification({
    type: "invite",
    message: "You are invited to an organization. Go to Settings to accept.",
    link: "/settings",
  });
};

export const notifyAdminInviteAccepted = (nameOrEmail: string) => {
  const currentUser = getCurrentUser();
  if (currentUser.role !== "admin") return;

  addNotification({
    type: "invite_accepted",
    message: `${nameOrEmail} accepted your organization invite.`,
    link: "/settings",
  });
};

export const markUserInviteAsAccepted = () => {
  setCurrentUserInviteStatus("accepted");
  const next = getNotifications().map((n) =>
    n.type === "invite" ? { ...n, read: true } : n
  );
  saveNotifications(next);
  emitChange();
};
