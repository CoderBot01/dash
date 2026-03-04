import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { reps, leads, stageLabels } from "@/data/mockData";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Flame,
  Clock,
  Diamond,
  Phone,
  FileText,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Target,
  Briefcase,
  Users,
  Mail,
  MapPin,
} from "lucide-react";
import { useState } from "react";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const intentColor = (intent: string) => {
  if (intent === "High") return "text-status-momentum";
  if (intent === "Medium") return "text-status-new";
  return "text-muted-foreground";
};

const relationshipColor = (value: string) => {
  if (value === "Strong") return "text-status-momentum";
  if (value === "Moderate") return "text-status-new";
  if (value === "Weak") return "text-status-overdue";
  return "text-muted-foreground";
};

const urgencyColor = (value: string) => {
  if (value === "Critical") return "text-status-overdue";
  if (value === "High") return "text-status-stalled";
  if (value === "Medium") return "text-status-new";
  return "text-muted-foreground";
};

export default function RepDetailPage() {
  const { id } = useParams();
  const rep = reps.find((r) => r.id === id);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  if (!rep) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-muted-foreground">Rep not found.</p>
          <Link to="/teams" className="text-primary text-sm mt-2 inline-block">
            Back to Teams
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const repLeads = leads.filter((l) => l.assignedRepId === id);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] p-4 sm:p-6 lg:p-8">
        <Link
          to="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Teams
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {rep.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{rep.name}</h1>
            <p className="text-sm text-muted-foreground">
              {rep.role} - Activity Score: {rep.activityScore}%
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="New Leads"
            value={rep.newLeads}
            trend="+1"
            subtitle="this week"
            variant="new"
            icon={<Plus className="h-5 w-5" />}
          />
          <KPICard
            title="Hot Leads"
            value={rep.hotLeads}
            trend=""
            subtitle="active momentum"
            variant="momentum"
            icon={<Flame className="h-5 w-5" />}
          />
          <KPICard
            title="Overdue"
            value={rep.overdue}
            trend=""
            subtitle="need attention"
            variant="overdue"
            icon={<Clock className="h-5 w-5" />}
          />
          <KPICard
            title="High Value"
            value={rep.highValue}
            trend=""
            subtitle="leads"
            variant="highvalue"
            icon={<Diamond className="h-5 w-5" />}
          />
        </div>

        <div className="mb-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-[1100px] lg:w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-2 py-3 w-8" />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Lead Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned Rep
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Summary
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Deal Value
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Intent
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Last Update
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Next Follow-up
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {repLeads.map((lead) => {
                const isExpanded = expandedLeadId === lead.id;

                return (
                  <>
                    <tr
                      key={lead.id}
                      className="border-b last:border-0 hover:bg-accent/40 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedLeadId((prev) => (prev === lead.id ? null : lead.id))
                      }
                    >
                      <td className="px-2 py-3 text-muted-foreground">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-muted-foreground">
                        {lead.company}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-card-foreground">
                        {lead.assignedRep}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-card-foreground">
                        {stageLabels[lead.stage]}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-muted-foreground max-w-[260px]">
                        {lead.summaryNote}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">
                        ${lead.dealValue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-card-foreground">
                        {titleCase(lead.momentum)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-muted-foreground">
                        {lead.lastUpdate}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-muted-foreground">
                        {formatDate(lead.nextFollowUp)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-card-foreground">
                        {titleCase(lead.status)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${lead.id}-detail`} className="border-b last:border-0 bg-background/30">
                        <td colSpan={11} className="p-4">
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
                            <div className="space-y-4">
                              <div className="rounded-lg border bg-background p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  Executive Summary
                                </h4>
                                <p className="text-[13px] text-foreground leading-relaxed">{lead.summaryNote}</p>
                              </div>

                              <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                  <Target className="h-3.5 w-3.5" />
                                  Next Action
                                </h4>
                                <p className="text-[13px] font-medium text-foreground">{lead.nextAction}</p>
                              </div>

                              <div className="rounded-lg border bg-background p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                  Primary Pain Point
                                </h4>
                                <p className="text-[13px] text-foreground">{lead.primaryPainPoint}</p>
                              </div>

                              <div className="flex flex-col gap-2 text-[12px] text-muted-foreground px-1">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 shrink-0" />
                                  <span>{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span>{lead.address}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="rounded-lg border bg-background p-4 space-y-2.5">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  Deal Snapshot
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-[12px]">
                                  <div>
                                    <span className="text-muted-foreground">Role: </span>
                                    <span className="font-medium text-foreground">{lead.roleTitle}</span>
                                    <span className="text-muted-foreground"> ({lead.roleInfluence})</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Company Size: </span>
                                    <span className="font-medium text-foreground">{lead.companySize}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Industry: </span>
                                    <span className="font-medium text-foreground">{lead.industry}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Source: </span>
                                    <span className="font-medium text-foreground">{lead.source}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Probability: </span>
                                    <span className="font-medium text-foreground">{lead.probability}%</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Timeline: </span>
                                    <span className="font-medium text-foreground">{lead.expectedTimeline}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[13px] font-semibold text-foreground">
                                    ${lead.dealValue.toLocaleString()}
                                  </span>
                                  <span className={`text-[11px] font-semibold ${intentColor(lead.buyingIntent)}`}>
                                    {lead.buyingIntent} Intent
                                  </span>
                                </div>
                              </div>

                              <div className="rounded-lg border bg-background p-4 space-y-2">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Risk & Competition
                                </h4>
                                <div className="text-[12px]">
                                  <span className="text-muted-foreground">Key Objection: </span>
                                  <span
                                    className={`font-medium ${
                                      lead.followUpUrgency === "Critical"
                                        ? "text-destructive"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {lead.keyObjection}
                                  </span>
                                </div>
                                <div className="text-[12px]">
                                  <span className="text-muted-foreground">Competitor: </span>
                                  <span className="text-foreground">{lead.competitivePresence}</span>
                                </div>
                              </div>

                              <div className="rounded-lg border bg-background p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <Users className="h-3.5 w-3.5" />
                                  Relationship & Urgency
                                </h4>
                                <div className="flex items-center gap-4 text-[12px] font-semibold">
                                  <span className={relationshipColor(lead.relationshipStrength)}>
                                    {lead.relationshipStrength}
                                  </span>
                                  <span className={urgencyColor(lead.followUpUrgency)}>
                                    {lead.followUpUrgency} Urgency
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {repLeads.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No leads assigned to this rep.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
