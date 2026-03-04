import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { reps as initialReps, Rep } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type TeamMember = Rep & {
  email: string;
};

const buildInitials = (name: string, email: string) => {
  if (name.trim()) {
    return name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return email.slice(0, 2).toUpperCase();
};

const defaultEmailFromName = (name: string) =>
  `${name.toLowerCase().replace(/\s+/g, ".")}@leadpulse.com`;

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function TeamsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialReps.map((rep) => ({ ...rep, role: "user", email: defaultEmailFromName(rep.name) }))
  );
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const resetForm = () => {
    setName("");
    setRole("");
    setEmail("");
    setEditingId(null);
  };

  const openEdit = (rep: TeamMember) => {
    setEditingId(rep.id);
    setName(rep.name);
    setRole(rep.role);
    setEmail(rep.email);
    setOpen(true);
  };

  const handleSave = () => {
    if (!editingId) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    setTeamMembers((prev) =>
      prev.map((rep) => {
        if (rep.id !== editingId) return rep;

        return {
          ...rep,
          name: trimmedName,
          role,
          email: trimmedEmail,
          avatar: buildInitials(trimmedName, trimmedEmail),
        };
      })
    );

    toast.success("Team member updated");
    setOpen(false);
    resetForm();
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teams</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {teamMembers.length} team members
            </p>
          </div>
        </div>

        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) resetForm();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update member details and access role.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Access Role (Optional)</Label>
                <Select
                  value={role || "none"}
                  onValueChange={(value) => setRole(value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No role selected" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!email.trim() || !editingId}>
                Update Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((rep) => (
            <div
              key={rep.id}
              className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <Link to={`/teams/${rep.id}`} className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                    {rep.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-card-foreground truncate">
                      {rep.name || "Unnamed Member"}
                    </p>
                    <p className="text-[12px] text-muted-foreground truncate">{rep.role || "No role"}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{rep.email}</p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => openEdit(rep)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                {[
                  ["Leads", rep.leadsCount],
                  ["New", rep.newLeads],
                  ["Hot", rep.hotLeads],
                  ["Overdue", rep.overdue],
                  ["High Value", rep.highValue],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between text-[12px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-card-foreground">{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-status-momentum transition-all"
                      style={{ width: `${rep.activityScore}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-card-foreground">
                    {rep.activityScore}%
                  </span>
                </div>
                <Link
                  to={`/teams/${rep.id}`}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
