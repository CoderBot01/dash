import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { leads, messages, stageLabels } from "@/data/mockData";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, FileText, ArrowRightLeft, AlertTriangle, Calendar, MessageSquare, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const timeline = [
  { id: '1', type: 'call', icon: Phone, color: 'bg-status-new-bg text-status-new', title: 'Discovery call completed', desc: 'Discussed requirements and timeline. Client is looking for Q2 rollout.', time: '2h ago', rep: 'James Wilson' },
  { id: '2', type: 'note', icon: FileText, color: 'bg-muted text-muted-foreground', title: 'Added meeting notes', desc: 'Budget confirmed at $80-100K range. Decision maker is VP of Engineering.', time: '1d ago', rep: 'James Wilson' },
  { id: '3', type: 'stage', icon: ArrowRightLeft, color: 'bg-status-highvalue-bg text-status-highvalue', title: 'Stage changed to Proposal', desc: 'Moved from Qualified → Proposal after successful demo.', time: '3d ago', rep: 'James Wilson' },
  { id: '4', type: 'missed', icon: AlertTriangle, color: 'bg-status-overdue-bg text-status-overdue', title: 'Missed follow-up', desc: 'Follow-up call was scheduled but not completed.', time: '5d ago', rep: 'James Wilson' },
  { id: '5', type: 'follow_up', icon: Calendar, color: 'bg-status-new-bg text-status-new', title: 'Follow-up scheduled', desc: 'Set meeting for product demo with technical team.', time: '1w ago', rep: 'James Wilson' },
  { id: '6', type: 'message', icon: MessageSquare, color: 'bg-status-new-bg text-status-new', title: 'Manager comment', desc: 'Great progress on this one. Make sure to send the case study.', time: '1w ago', rep: 'Mike Kellner' },
];

export default function LeadDetailPage() {
  const { id } = useParams();
  const lead = leads.find((l) => l.id === id);
  const [msg, setMsg] = useState("");

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-muted-foreground">Lead not found.</p>
          <Link to="/leads" className="text-primary text-sm mt-2 inline-block">← Back to Leads</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1400px]">
        {/* Back */}
        <Link to="/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{lead.company} · {lead.assignedRep}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge type="momentum" value={lead.momentum} />
            <StatusBadge type="stage" value={lead.stage} />
            {lead.status === "overdue" && <StatusBadge type="status" value="overdue" />}
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-[1fr_340px] gap-6">
          {/* Left - Timeline */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-5">Lead Timeline</h3>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <div key={item.id} className="flex gap-3 relative">
                  {/* Line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[13px] top-8 bottom-0 w-px bg-border" />
                  )}
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.color} z-10`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="pb-6 min-w-0">
                    <p className="text-[13px] font-medium text-card-foreground">{item.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{item.rep} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-4">
            {/* Quick Info */}
            <div className="rounded-xl border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-card-foreground">Deal Info</h3>
              <div className="space-y-2">
                {[
                  ["Deal Value", `$${lead.dealValue.toLocaleString()}`],
                  ["Stage", stageLabels[lead.stage]],
                  ["Probability", `${lead.probability}%`],
                  ["Source", lead.source],
                  ["Next Follow-up", lead.nextFollowUp],
                  ["Email", lead.email],
                  ["Phone", lead.phone],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-card-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="rounded-xl border border-status-highvalue/20 bg-status-highvalue-bg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-status-highvalue" />
                <span className="text-[13px] font-semibold text-status-highvalue">AI Suggested Action</span>
              </div>
              <p className="text-[12px] text-foreground">
                Send the ROI calculator and case study from the FinTech vertical. This lead matches the profile of deals that close 2x faster with these assets.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Request Update", "Escalate", "Reassign Lead", "Send Message"].map((action) => (
                  <button
                    key={action}
                    className="rounded-lg border bg-card px-3 py-2 text-[12px] font-medium text-card-foreground hover:bg-accent transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Manager Chat */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Manager Notes</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                {messages.slice(0, 3).map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.senderRole === "manager" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-[90%] text-[12px] ${
                      m.senderRole === "manager" ? "bg-primary text-primary-foreground" : "bg-muted text-card-foreground"
                    }`}>
                      {m.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{m.sender} · {m.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90 transition-opacity">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
