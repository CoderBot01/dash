import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail, Phone, PencilLine, LogOut, Shield, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUserInviteStatus } from "@/lib/notifications";

type ProfileData = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
};

const STORAGE_KEY = "leadpulse_profile";
const ORGANIZATION_KEY = "leadpulse_organization";

const defaultProfile: ProfileData = {
  firstName: "PRAVEENKUMAR",
  lastName: "",
  role: "User",
  email: "praveenkumarellai555@gmail.com",
  phone: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [organizationName, setOrganizationName] = useState("LeadPulse Inc");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ProfileData;
      setProfile(parsed);
      setDraft(parsed);
    } catch {
      setProfile(defaultProfile);
      setDraft(defaultProfile);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(ORGANIZATION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { name?: string };
      if (parsed.name) setOrganizationName(parsed.name);
    } catch {
      // ignore invalid local storage payload
    }
  }, []);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || "User";
  const initial = fullName.charAt(0).toUpperCase();
  const hasAcceptedInvite = getCurrentUserInviteStatus() === "accepted";

  const handleSave = () => {
    const next: ProfileData = {
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      role: draft.role.trim() || "User",
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    };

    if (!next.email) {
      toast.error("Email is required");
      return;
    }

    setProfile(next);
    setDraft(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIsEditing(false);
    toast.success("Profile updated");
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1d2a44] text-3xl font-semibold text-white">
              {initial}
            </div>
            <h2 className="text-center text-xl font-bold uppercase text-foreground">{fullName}</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>{profile.role || "User"}</span>
            </div>

            <div className="my-5 border-t" />

            <div className="space-y-3 text-sm text-muted-foreground">
              {hasAcceptedInvite && (
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4" />
                  <span className="break-all">Organization: {organizationName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="break-all">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{profile.phone || "Not provided"}</span>
              </div>
            </div>

            {!isEditing && (
              <Button variant="outline" className="mt-6 w-full" onClick={() => setIsEditing(true)}>
                <PencilLine className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}

            <button
              type="button"
              className="mt-4 inline-flex items-center text-sm font-semibold text-red-500 hover:text-red-600"
              onClick={() => toast.info("Logout action not connected yet")}
            >
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </button>
          </section>

          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Account Details</h3>
              </div>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">First Name</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{profile.firstName || "-"}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Last Name</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{profile.lastName || "-"}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{profile.role || "User"}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{profile.phone || "Not provided"}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm font-medium text-foreground break-all">{profile.email}</p>
                </div>
                {hasAcceptedInvite && (
                  <div className="rounded-lg border bg-muted/30 p-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Organization</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{organizationName}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={draft.firstName}
                      onChange={(e) => setDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={draft.lastName}
                      onChange={(e) => setDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={draft.role}
                      onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={draft.phone}
                      onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={draft.email}
                      disabled
                      className="mt-2"
                    />
                  </div>
                  {hasAcceptedInvite && (
                    <div className="sm:col-span-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input id="organization" value={organizationName} disabled className="mt-2" />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleSave} className="sm:min-w-[160px]">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDraft(profile);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
