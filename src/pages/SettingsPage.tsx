import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getCurrentUser,
  getCurrentUserInviteStatus,
  markUserInviteAsAccepted,
  notifyAdminInviteAccepted,
  notifyCurrentUserInvite,
} from "@/lib/notifications";

type AccessRole = "user" | "admin";
type InviteStatus = "pending" | "accepted";

type TeamAccess = {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
  status: InviteStatus;
  invitedAt: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const ORGANIZATION_KEY = "leadpulse_organization";

export default function SettingsPage() {
  const currentUser = getCurrentUser();
  const currentUserInviteStatus = getCurrentUserInviteStatus();
  const [organizationName, setOrganizationName] = useState("LeadPulse Inc");
  const [industry, setIndustry] = useState("B2B SaaS");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccessRole>("user");
  const [teamAccess, setTeamAccess] = useState<TeamAccess[]>([
    {
      id: "1",
      name: "James Wilson",
      email: "james@leadpulse.com",
      role: "admin",
      status: "accepted",
      invitedAt: "2026-02-20",
    },
    {
      id: "2",
      name: "Emily Park",
      email: "emily@leadpulse.com",
      role: "user",
      status: "accepted",
      invitedAt: "2026-02-21",
    },
    {
      id: "3",
      name: "Rachel Green",
      email: "rachel@leadpulse.com",
      role: "user",
      status: "pending",
      invitedAt: "2026-03-02",
    },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(ORGANIZATION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { name?: string; industry?: string };
      if (parsed.name) setOrganizationName(parsed.name);
      if (parsed.industry) setIndustry(parsed.industry);
    } catch {
      // ignore invalid local storage payload
    }
  }, []);

  const pendingInvites = useMemo(
    () => teamAccess.filter((member) => member.status === "pending"),
    [teamAccess]
  );

  const acceptedMembers = useMemo(
    () => teamAccess.filter((member) => member.status === "accepted"),
    [teamAccess]
  );

  const handleInvite = () => {
    const email = inviteEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const alreadyExists = teamAccess.some((member) => member.email.toLowerCase() === email);
    if (alreadyExists) {
      toast.error("This email is already invited or added");
      return;
    }

    setTeamAccess((prev) => [
      {
        id: String(Date.now()),
        name: "",
        email,
        role: inviteRole,
        status: "pending",
        invitedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

    notifyCurrentUserInvite(email);
    setInviteEmail("");
    setInviteRole("user");
    toast.success("Invitation sent");
  };

  const updateRole = (id: string, role: AccessRole) => {
    setTeamAccess((prev) => prev.map((member) => (member.id === id ? { ...member, role } : member)));
  };

  const markAccepted = (id: string) => {
    let acceptedMemberName = "";
    let acceptedMemberEmail = "";
    setTeamAccess((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member;
        acceptedMemberName = member.name;
        acceptedMemberEmail = member.email;
        return { ...member, status: "accepted" };
      })
    );

    if (currentUser.role === "admin") {
      notifyAdminInviteAccepted(acceptedMemberName || acceptedMemberEmail);
    }

    if (acceptedMemberEmail.toLowerCase() === currentUser.email && currentUser.role === "user") {
      markUserInviteAsAccepted();
    }

    toast.success("Invite marked as accepted");
  };

  const saveOrganization = () => {
    if (!organizationName.trim() || !industry.trim()) {
      toast.error("Organization name and industry are required");
      return;
    }
    localStorage.setItem(
      ORGANIZATION_KEY,
      JSON.stringify({
        name: organizationName.trim(),
        industry: industry.trim(),
      })
    );
    toast.success("Organization settings updated");
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization preferences</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-[15px] font-semibold text-card-foreground">Organization</h3>
            <p className="text-[13px] text-muted-foreground mt-1 mb-4">Company name, logo, and billing</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization-name">Organization Name</Label>
                <Input
                  id="organization-name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
              <div>
                <Button onClick={saveOrganization}>Save Organization</Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div>
              <h3 className="text-[15px] font-semibold text-card-foreground">Team Access</h3>
              <p className="text-[13px] text-muted-foreground mt-1">
                Track pending invites, accepted members, and assign User/Admin access.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wider">Pending Email Invites</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingInvites.length}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wider">Accepted Team Members</p>
                <p className="text-2xl font-bold text-foreground mt-1">{acceptedMembers.length}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-[13px] font-medium text-card-foreground">Invite a Team Member</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(value: AccessRole) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleInvite}>Send Invite</Button>
                </div>
              </div>
            </div>

            {currentUser.role === "user" && currentUserInviteStatus === "pending" && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm text-card-foreground">
                  You are invited to join this organization.
                </p>
                <Button
                  className="mt-3"
                  onClick={() => {
                    markUserInviteAsAccepted();
                    toast.success("You joined the organization");
                  }}
                >
                  Accept My Invite
                </Button>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-[760px] md:w-full">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamAccess.map((member) => (
                    <tr key={member.id} className="border-b last:border-0">
                      <td className="px-4 py-3 text-[13px] text-card-foreground">{member.email}</td>
                      <td className="px-4 py-3 text-[13px] text-card-foreground">{member.name || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={member.status === "accepted" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 w-[180px]">
                        <Select value={member.role} onValueChange={(value: AccessRole) => updateRole(member.id, value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        {member.status === "pending" ? (
                          <Button size="sm" variant="outline" onClick={() => markAccepted(member.id)}>
                            {member.email.toLowerCase() === currentUser.email && currentUser.role === "user"
                              ? "Accept Invite"
                              : "Mark Accepted"}
                          </Button>
                        ) : (
                          <span className="text-[12px] text-muted-foreground">Accepted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
