// Dummy data for LeadPulse dashboard

export interface Lead {
  id: string;
  name: string;
  company: string;
  assignedRep: string;
  assignedRepId: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  dealValue: number;
  momentum: 'hot' | 'warm' | 'stalled' | 'cold';
  lastUpdate: string;
  nextFollowUp: string;
  status: 'active' | 'overdue' | 'at-risk' | 'won' | 'lost';
  email: string;
  phone: string;
  source: string;
  probability: number;
  address: string;
  roleTitle: string;
  roleInfluence: 'Decision Maker' | 'Influencer' | 'Champion' | 'Gatekeeper' | 'End User';
  companySize: string;
  industry: string;
  primaryPainPoint: string;
  buyingIntent: 'High' | 'Medium' | 'Low';
  expectedTimeline: string;
  keyObjection: string;
  competitivePresence: string;
  relationshipStrength: 'Strong' | 'Moderate' | 'Weak' | 'New';
  followUpUrgency: 'Critical' | 'High' | 'Medium' | 'Low';
  summaryNote: string;
  nextAction: string;
}

export interface Rep {
  id: string;
  name: string;
  role: string;
  avatar: string;
  leadsCount: number;
  newLeads: number;
  hotLeads: number;
  overdue: number;
  highValue: number;
  activityScore: number;
  lastActivity: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'note' | 'stage_change' | 'follow_up' | 'missed' | 'message' | 'deal_closed' | 'lead_added';
  description: string;
  timestamp: string;
  repName: string;
  leadName?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderRole: 'manager' | 'rep';
  content: string;
  timestamp: string;
}

export const leads: Lead[] = [
  { id: '1', name: 'Sarah Chen', company: 'TechVision Inc', assignedRep: 'James Wilson', assignedRepId: '1', stage: 'proposal', dealValue: 85000, momentum: 'hot', lastUpdate: '2h ago', nextFollowUp: '2026-03-03', status: 'active', email: 'sarah@techvision.com', phone: '+1 555-0142', source: 'Referral', probability: 75, address: '450 Tech Blvd, San Francisco, CA', roleTitle: 'CEO', roleInfluence: 'Decision Maker', companySize: '200–500', industry: 'Enterprise SaaS', primaryPainPoint: 'Legacy CRM limiting pipeline visibility', buyingIntent: 'High', expectedTimeline: '30 days', keyObjection: 'Budget approval pending from CFO', competitivePresence: 'Salesforce (incumbent)', relationshipStrength: 'Strong', followUpUrgency: 'Critical', summaryNote: 'Ready to move forward, needs ROI validation', nextAction: 'Send ROI deck and schedule exec call' },
  { id: '2', name: 'Marcus Rivera', company: 'DataFlow Corp', assignedRep: 'Emily Park', assignedRepId: '2', stage: 'negotiation', dealValue: 120000, momentum: 'hot', lastUpdate: '4h ago', nextFollowUp: '2026-03-04', status: 'active', email: 'marcus@dataflow.com', phone: '+1 555-0198', source: 'Website', probability: 85, address: '88 Data Ave, Austin, TX', roleTitle: 'VP of Sales', roleInfluence: 'Champion', companySize: '500–1000', industry: 'Data Analytics', primaryPainPoint: 'No centralized follow-up tracking', buyingIntent: 'High', expectedTimeline: '14 days', keyObjection: 'Integration with existing Slack workflow', competitivePresence: 'HubSpot (evaluating)', relationshipStrength: 'Strong', followUpUrgency: 'High', summaryNote: 'Champion pushing internally, contract review stage', nextAction: 'Finalize pricing and send contract draft' },
  { id: '3', name: 'Anna Kowalski', company: 'CloudScale', assignedRep: 'James Wilson', assignedRepId: '1', stage: 'qualified', dealValue: 45000, momentum: 'stalled', lastUpdate: '5d ago', nextFollowUp: '2026-02-26', status: 'overdue', email: 'anna@cloudscale.io', phone: '+1 555-0234', source: 'Cold Outreach', probability: 35, address: '12 Cloud St, Denver, CO', roleTitle: 'Head of Ops', roleInfluence: 'Influencer', companySize: '50–200', industry: 'Cloud Infrastructure', primaryPainPoint: 'Reps missing follow-ups on key accounts', buyingIntent: 'Medium', expectedTimeline: '60 days', keyObjection: 'Team adoption concerns', competitivePresence: 'Pipedrive (current)', relationshipStrength: 'Moderate', followUpUrgency: 'Critical', summaryNote: 'Went silent after demo, needs re-engagement', nextAction: 'Send case study and request 15-min check-in' },
  { id: '4', name: 'David Okafor', company: 'FinEdge Ltd', assignedRep: 'Sarah Martinez', assignedRepId: '3', stage: 'new', dealValue: 200000, momentum: 'warm', lastUpdate: '1d ago', nextFollowUp: '2026-03-05', status: 'active', email: 'david@finedge.com', phone: '+1 555-0167', source: 'Conference', probability: 20, address: '900 Finance Row, New York, NY', roleTitle: 'CRO', roleInfluence: 'Decision Maker', companySize: '1000+', industry: 'FinTech', primaryPainPoint: 'No visibility into field rep activity', buyingIntent: 'Medium', expectedTimeline: '90 days', keyObjection: 'Security and compliance requirements', competitivePresence: 'None identified', relationshipStrength: 'New', followUpUrgency: 'Medium', summaryNote: 'Met at SaaS Connect, high potential enterprise deal', nextAction: 'Schedule discovery call with VP Sales' },
  { id: '5', name: 'Lisa Zhang', company: 'AI Solutions', assignedRep: 'Emily Park', assignedRepId: '2', stage: 'contacted', dealValue: 67000, momentum: 'cold', lastUpdate: '8d ago', nextFollowUp: '2026-02-23', status: 'overdue', email: 'lisa@aisolutions.co', phone: '+1 555-0289', source: 'LinkedIn', probability: 15, address: '33 AI Park, Seattle, WA', roleTitle: 'Office Manager', roleInfluence: 'Gatekeeper', companySize: '50–200', industry: 'Artificial Intelligence', primaryPainPoint: 'Manual lead tracking in spreadsheets', buyingIntent: 'Low', expectedTimeline: 'Undefined', keyObjection: 'Not a priority this quarter', competitivePresence: 'Monday.com (workaround)', relationshipStrength: 'Weak', followUpUrgency: 'Low', summaryNote: 'Low engagement, may revisit next quarter', nextAction: 'Add to nurture sequence, check back in 30 days' },
  { id: '6', name: 'Robert Kim', company: 'NexGen Systems', assignedRep: 'Tom Bradley', assignedRepId: '4', stage: 'proposal', dealValue: 150000, momentum: 'hot', lastUpdate: '1h ago', nextFollowUp: '2026-03-03', status: 'active', email: 'robert@nexgen.com', phone: '+1 555-0312', source: 'Referral', probability: 70, address: '77 Innovation Dr, Boston, MA', roleTitle: 'Director of IT', roleInfluence: 'Champion', companySize: '500–1000', industry: 'IT Services', primaryPainPoint: 'Scaling sales ops without adding headcount', buyingIntent: 'High', expectedTimeline: '21 days', keyObjection: 'Needs multi-region support', competitivePresence: 'Freshsales (trial)', relationshipStrength: 'Strong', followUpUrgency: 'Critical', summaryNote: 'Proposal sent, awaiting feedback from procurement', nextAction: 'Follow up on proposal and address multi-region Q' },
  { id: '7', name: 'Elena Popov', company: 'GreenTech Energy', assignedRep: 'Sarah Martinez', assignedRepId: '3', stage: 'negotiation', dealValue: 95000, momentum: 'warm', lastUpdate: '2d ago', nextFollowUp: '2026-03-06', status: 'active', email: 'elena@greentech.com', phone: '+1 555-0345', source: 'Website', probability: 60, address: '200 Green Way, Portland, OR', roleTitle: 'VP of Operations', roleInfluence: 'Influencer', companySize: '200–500', industry: 'Clean Energy', primaryPainPoint: 'Disconnected sales and ops teams', buyingIntent: 'Medium', expectedTimeline: '45 days', keyObjection: 'Prefers annual billing only', competitivePresence: 'Zoho CRM (legacy)', relationshipStrength: 'Moderate', followUpUrgency: 'High', summaryNote: 'Negotiating terms, decision maker loop pending', nextAction: 'Prepare annual billing proposal and send' },
  { id: '8', name: 'Amir Hassan', company: 'SecureNet Pro', assignedRep: 'James Wilson', assignedRepId: '1', stage: 'qualified', dealValue: 310000, momentum: 'hot', lastUpdate: '3h ago', nextFollowUp: '2026-03-03', status: 'active', email: 'amir@securenet.com', phone: '+1 555-0401', source: 'Partner', probability: 55, address: '500 Secure Blvd, Chicago, IL', roleTitle: 'CTO', roleInfluence: 'Decision Maker', companySize: '1000+', industry: 'Cybersecurity', primaryPainPoint: 'No single source of truth for deal status', buyingIntent: 'High', expectedTimeline: '30 days', keyObjection: 'Requires SOC2 compliance proof', competitivePresence: 'Salesforce (considering switch)', relationshipStrength: 'Strong', followUpUrgency: 'Critical', summaryNote: 'High-value enterprise, CTO is champion', nextAction: 'Send SOC2 docs and schedule technical deep-dive' },
  { id: '9', name: 'Jennifer Brooks', company: 'MediaPulse', assignedRep: 'Tom Bradley', assignedRepId: '4', stage: 'new', dealValue: 28000, momentum: 'warm', lastUpdate: '1d ago', nextFollowUp: '2026-03-07', status: 'active', email: 'jen@mediapulse.io', phone: '+1 555-0456', source: 'Inbound', probability: 10, address: '15 Media Ln, Los Angeles, CA', roleTitle: 'Marketing Lead', roleInfluence: 'End User', companySize: '10–50', industry: 'Digital Media', primaryPainPoint: 'Losing track of warm leads', buyingIntent: 'Low', expectedTimeline: '90 days', keyObjection: 'Small team, unsure of ROI', competitivePresence: 'Google Sheets (manual)', relationshipStrength: 'New', followUpUrgency: 'Medium', summaryNote: 'Early stage, exploring options for small team', nextAction: 'Send small-team case study and schedule intro call' },
  { id: '10', name: 'Carlos Mendez', company: 'LogiChain', assignedRep: 'Emily Park', assignedRepId: '2', stage: 'contacted', dealValue: 73000, momentum: 'stalled', lastUpdate: '6d ago', nextFollowUp: '2026-02-25', status: 'at-risk', email: 'carlos@logichain.com', phone: '+1 555-0512', source: 'Cold Outreach', probability: 25, address: '640 Supply Rd, Dallas, TX', roleTitle: 'Supply Chain Manager', roleInfluence: 'Influencer', companySize: '200–500', industry: 'Supply Chain & Logistics', primaryPainPoint: 'Sales team lacks accountability tools', buyingIntent: 'Medium', expectedTimeline: '60 days', keyObjection: 'Needs approval from parent company', competitivePresence: 'Close.com (evaluating)', relationshipStrength: 'Weak', followUpUrgency: 'High', summaryNote: 'Stalled after initial call, parent company blocker', nextAction: 'Escalate with value prop doc for parent company review' },
];

export const reps: Rep[] = [
  { id: '1', name: 'James Wilson', role: 'Senior Sales Rep', avatar: 'JW', leadsCount: 12, newLeads: 3, hotLeads: 4, overdue: 1, highValue: 2, activityScore: 92, lastActivity: '2h ago' },
  { id: '2', name: 'Emily Park', role: 'Sales Rep', avatar: 'EP', leadsCount: 9, newLeads: 2, hotLeads: 2, overdue: 2, highValue: 1, activityScore: 78, lastActivity: '4h ago' },
  { id: '3', name: 'Sarah Martinez', role: 'Sales Rep', avatar: 'SM', leadsCount: 8, newLeads: 4, hotLeads: 1, overdue: 0, highValue: 3, activityScore: 85, lastActivity: '1d ago' },
  { id: '4', name: 'Tom Bradley', role: 'Junior Sales Rep', avatar: 'TB', leadsCount: 6, newLeads: 1, hotLeads: 2, overdue: 0, highValue: 1, activityScore: 71, lastActivity: '5h ago' },
  { id: '5', name: 'Rachel Green', role: 'Sales Rep', avatar: 'RG', leadsCount: 10, newLeads: 2, hotLeads: 3, overdue: 3, highValue: 2, activityScore: 64, lastActivity: '2d ago' },
];

export const recentActivities: Activity[] = [
  { id: '1', type: 'call', description: 'Completed discovery call with Sarah Chen', timestamp: '2h ago', repName: 'James Wilson', leadName: 'Sarah Chen' },
  { id: '2', type: 'stage_change', description: 'Moved Marcus Rivera to Negotiation', timestamp: '4h ago', repName: 'Emily Park', leadName: 'Marcus Rivera' },
  { id: '3', type: 'missed', description: 'Missed follow-up with Anna Kowalski', timestamp: '5h ago', repName: 'James Wilson', leadName: 'Anna Kowalski' },
  { id: '4', type: 'note', description: 'Added meeting notes for David Okafor', timestamp: '1d ago', repName: 'Sarah Martinez', leadName: 'David Okafor' },
  { id: '5', type: 'deal_closed', description: 'Closed deal with Premier Systems — $62,000', timestamp: '1d ago', repName: 'Tom Bradley' },
  { id: '6', type: 'lead_added', description: 'Added new lead Jennifer Brooks from MediaPulse', timestamp: '1d ago', repName: 'Tom Bradley', leadName: 'Jennifer Brooks' },
  { id: '7', type: 'follow_up', description: 'Scheduled follow-up with Robert Kim', timestamp: '1d ago', repName: 'Tom Bradley', leadName: 'Robert Kim' },
  { id: '8', type: 'message', description: 'Manager requested update on Elena Popov', timestamp: '2d ago', repName: 'Sarah Martinez', leadName: 'Elena Popov' },
];

export const messages: Message[] = [
  { id: '1', sender: 'You', senderRole: 'manager', content: 'Hey James, what\'s the status on the SecureNet deal? They seemed very interested last week.', timestamp: '10:30 AM' },
  { id: '2', sender: 'James Wilson', senderRole: 'rep', content: 'Just got off a call with Amir. They want to move forward but need board approval. Should have an answer by Friday.', timestamp: '10:45 AM' },
  { id: '3', sender: 'You', senderRole: 'manager', content: 'Great. Make sure to send the ROI deck we prepared. That should help with the board presentation.', timestamp: '10:52 AM' },
  { id: '4', sender: 'James Wilson', senderRole: 'rep', content: 'Already on it! I\'ll also loop in their CTO for a technical deep-dive tomorrow.', timestamp: '11:05 AM' },
  { id: '5', sender: 'You', senderRole: 'manager', content: 'Perfect. Keep me posted. This is a big one.', timestamp: '11:08 AM' },
];

export const stageLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed: 'Closed',
};

export const momentumLabels: Record<string, string> = {
  hot: 'Hot',
  warm: 'Warm',
  stalled: 'Stalled',
  cold: 'Cold',
};
