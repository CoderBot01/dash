import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { leads as initialLeads, stageLabels, reps, Lead } from "@/data/mockData";
import { Search, ChevronDown, ChevronRight, FileText, Target, Mail, Phone, MapPin, Briefcase, AlertTriangle, Pencil } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { InlineEditField } from "@/components/InlineEditField";

const stageOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed", label: "Closed" },
];

const momentumOptions = [
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "stalled", label: "Stalled" },
  { value: "cold", label: "Cold" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "overdue", label: "Overdue" },
  { value: "at-risk", label: "At Risk" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const roleInfluenceOptions = [
  { value: "Decision Maker", label: "Decision Maker" },
  { value: "Influencer", label: "Influencer" },
  { value: "Champion", label: "Champion" },
  { value: "Gatekeeper", label: "Gatekeeper" },
  { value: "End User", label: "End User" },
];

const buyingIntentOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const repOptions = reps.map((r) => ({ value: r.id, label: r.name }));

export default function LeadsPage() {
  const [leadsData, setLeadsData] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [repFilter, setRepFilter] = useState("all");
  const [momentumFilter, setMomentumFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const updateLead = useCallback((id: string, field: keyof Lead, value: string | number) => {
    setLeadsData((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        if (field === "assignedRepId") {
          const rep = reps.find((r) => r.id === value);
          return { ...l, assignedRepId: String(value), assignedRep: rep?.name ?? l.assignedRep };
        }
        return { ...l, [field]: value };
      })
    );
  }, []);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const momentumOrder: Record<string, number> = { hot: 0, warm: 1, stalled: 2, cold: 3 };

  const filtered = leadsData.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (stageFilter !== "all" && l.stage !== stageFilter) return false;
    if (repFilter !== "all" && l.assignedRepId !== repFilter) return false;
    if (momentumFilter !== "all" && l.momentum !== momentumFilter) return false;
    return true;
  });

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "company": cmp = a.company.localeCompare(b.company); break;
        case "rep": cmp = a.assignedRep.localeCompare(b.assignedRep); break;
        case "stage": cmp = a.stage.localeCompare(b.stage); break;
        case "dealValue": cmp = a.dealValue - b.dealValue; break;
        case "momentum": cmp = (momentumOrder[a.momentum] ?? 9) - (momentumOrder[b.momentum] ?? 9); break;
        case "lastUpdate": cmp = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime(); break;
        case "nextFollowUp": cmp = new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime(); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">{leadsData.length} total leads across all reps</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-xs sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-card pl-9 pr-4 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className="min-w-[140px] rounded-lg border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Reps</option>
            {reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="min-w-[140px] rounded-lg border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Stages</option>
            {Object.entries(stageLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={momentumFilter} onChange={(e) => setMomentumFilter(e.target.value)} className="min-w-[140px] rounded-lg border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Intent</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="stalled">Stalled</option>
            <option value="cold">Cold</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-[1100px] lg:w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-2 py-3 w-8"></th>
                {([
                  ["Lead Name", "name"],
                  ["Company", "company"],
                  ["Assigned Rep", "rep"],
                  ["Stage", "stage"],
                  ["Summary", "summary"],
                  ["Deal Value", "dealValue"],
                  ["Intent", "momentum"],
                  ["Last Update", "lastUpdate"],
                  ["Next Follow-up", "nextFollowUp"],
                  ["Status", "status"],
                ] as [string, string][]).map(([label, key]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {sortKey === key ? (
                        sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />
                      ) : (
                        <span className="h-3 w-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((lead) => {
                const isExpanded = expandedRows.has(lead.id);
                return (
                  <>
                    <tr
                      key={lead.id}
                      className="border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => toggleRow(lead.id)}
                    >
                      <td className="px-2 py-3 text-muted-foreground">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.name} onChange={(v) => updateLead(lead.id, "name", v)} className="text-[13px] font-medium text-card-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.company} onChange={(v) => updateLead(lead.id, "company", v)} className="text-[13px] text-muted-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.assignedRepId} onChange={(v) => updateLead(lead.id, "assignedRepId", v)} type="select" options={repOptions} displayValue={lead.assignedRep} className="text-[13px] text-card-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.stage} onChange={(v) => updateLead(lead.id, "stage", v)} type="select" options={stageOptions} displayValue={stageLabels[lead.stage]} className="text-[13px]" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.summaryNote} onChange={(v) => updateLead(lead.id, "summaryNote", v)} className="text-[12px] text-muted-foreground max-w-[220px]" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.dealValue} onChange={(v) => updateLead(lead.id, "dealValue", v)} type="number" displayValue={`$${lead.dealValue.toLocaleString()}`} className="text-[13px] font-medium text-card-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.momentum} onChange={(v) => updateLead(lead.id, "momentum", v)} type="select" options={momentumOptions} displayValue={lead.momentum.charAt(0).toUpperCase() + lead.momentum.slice(1)} className="text-[13px]" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.lastUpdate} onChange={(v) => updateLead(lead.id, "lastUpdate", v)} className="text-[13px] text-muted-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.nextFollowUp} onChange={(v) => updateLead(lead.id, "nextFollowUp", v)} type="date" displayValue={new Date(lead.nextFollowUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} className="text-[13px] text-muted-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <InlineEditField value={lead.status} onChange={(v) => updateLead(lead.id, "status", v)} type="select" options={statusOptions} displayValue={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)} className="text-[13px]" />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${lead.id}-detail`} className="border-b last:border-0">
                        <td colSpan={11} className="p-4">
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
                            {/* LEFT: Executive Summary */}
                            <div className="space-y-4">
                              {/* Executive Summary */}
                              <div className="rounded-lg border bg-background p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  Executive Summary
                                </h4>
                                <InlineEditField value={lead.summaryNote} onChange={(v) => updateLead(lead.id, "summaryNote", v)} type="textarea" className="text-[13px] text-foreground leading-relaxed" />
                              </div>

                              {/* Next Action */}
                              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                  <Target className="h-3.5 w-3.5" />
                                  Next Action
                                </h4>
                                <InlineEditField value={lead.nextAction} onChange={(v) => updateLead(lead.id, "nextAction", v)} type="textarea" className="text-[13px] font-medium text-foreground" />
                              </div>

                              {/* Pain Point */}
                              <div className="rounded-lg border bg-background p-4">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Primary Pain Point</h4>
                                <InlineEditField value={lead.primaryPainPoint} onChange={(v) => updateLead(lead.id, "primaryPainPoint", v)} type="textarea" className="text-[13px] text-foreground" />
                              </div>

                              {/* Contact Row */}
                              <div className="flex flex-col gap-2 text-[12px] text-muted-foreground px-1">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 shrink-0" />
                                  <InlineEditField value={lead.email} onChange={(v) => updateLead(lead.id, "email", v)} className="text-[12px]" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  <InlineEditField value={lead.phone} onChange={(v) => updateLead(lead.id, "phone", v)} className="text-[12px]" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <InlineEditField value={lead.address} onChange={(v) => updateLead(lead.id, "address", v)} className="text-[12px]" />
                                </div>
                              </div>
                            </div>

                            {/* RIGHT: Mini Cards */}
                            <div className="space-y-3">
                              {/* Deal Snapshot */}
                              <div className="rounded-lg border bg-background p-4 space-y-2.5">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  Deal Snapshot
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-[12px]">
                                  <div>
                                    <span className="text-muted-foreground">Role: </span>
                                    <InlineEditField value={lead.roleTitle} onChange={(v) => updateLead(lead.id, "roleTitle", v)} className="text-[12px] font-medium" />
                                    <span className="text-muted-foreground ml-1">(</span>
                                    <InlineEditField value={lead.roleInfluence} onChange={(v) => updateLead(lead.id, "roleInfluence", v)} type="select" options={roleInfluenceOptions} className="text-[12px]" />
                                    <span className="text-muted-foreground">)</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Company Size: </span>
                                    <InlineEditField value={lead.companySize} onChange={(v) => updateLead(lead.id, "companySize", v)} className="text-[12px] font-medium" />
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Industry: </span>
                                    <InlineEditField value={lead.industry} onChange={(v) => updateLead(lead.id, "industry", v)} className="text-[12px] font-medium" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[13px] font-semibold text-foreground">
                                    <InlineEditField value={lead.dealValue} onChange={(v) => updateLead(lead.id, "dealValue", v)} type="number" displayValue={`$${lead.dealValue.toLocaleString()}`} className="text-[13px] font-semibold" />
                                  </span>
                                  <InlineEditField value={lead.buyingIntent} onChange={(v) => updateLead(lead.id, "buyingIntent", v)} type="select" options={buyingIntentOptions} displayValue={`${lead.buyingIntent} Intent`} className={`text-[11px] font-semibold ${lead.buyingIntent === 'High' ? 'text-status-momentum' : lead.buyingIntent === 'Medium' ? 'text-status-new' : 'text-muted-foreground'}`} />
                                </div>
                              </div>

                              {/* Risk & Competition */}
                              <div className="rounded-lg border bg-background p-4 space-y-2">
                                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Risk & Competition
                                </h4>
                                <div className="text-[12px]">
                                  <span className="text-muted-foreground">Key Objection: </span>
                                  <InlineEditField value={lead.keyObjection} onChange={(v) => updateLead(lead.id, "keyObjection", v)} className={`text-[12px] font-medium ${lead.followUpUrgency === 'Critical' ? 'text-destructive' : 'text-foreground'}`} />
                                </div>
                                <div className="text-[12px]">
                                  <span className="text-muted-foreground">Competitor: </span>
                                  <InlineEditField value={lead.competitivePresence} onChange={(v) => updateLead(lead.id, "competitivePresence", v)} className="text-[12px]" />
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
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
