// ─── Types ───────────────────────────────────────────────────────────────────

export type CaseStatus = 'open' | 'resolved' | 'unknown' | 'archived';
export type CaseCategory = 'missing_person' | 'crime' | 'harassment' | 'scam' | 'accident' | 'corruption' | 'other';
export type CaseVisibility = 'public' | 'unlisted' | 'private';
export type UpdateState = 'draft' | 'approved' | 'rejected' | 'archived';
export type CommentState = 'visible' | 'removed' | 'flagged';
export type SourceLabel = 'police_report' | 'news_article' | 'personal_account' | 'social_post' | 'official_document' | 'other';

export interface User {
  id: string;
  handle: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  trust_level: number;
  created_at: string;
  status: 'active' | 'suspended';
}

export interface Case {
  id: string;
  case_id: string;
  title: string;
  summary: string;
  category: CaseCategory;
  location_text: string;
  incident_start_date: string;
  incident_end_date: string | null;
  status: CaseStatus;
  visibility: CaseVisibility;
  tags: string[];
  created_by: string;
  moderators: string[];
  created_at: string;
  updated_at: string;
  subscriber_count: number;
  comment_count: number;
  update_count: number;
  media?: UpdateMedia[];
}

export interface UpdateMedia {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
}

export interface Update {
  id: string;
  case_id: string;
  author_id: string;
  type: 'official_update' | 'correction' | 'status_change';
  title: string;
  body: string;
  state: UpdateState;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  media?: UpdateMedia[];
}

export interface Comment {
  id: string;
  case_id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string;
  state: CommentState;
  upvotes: number;
  created_at: string;
  replies?: Comment[];
}

export interface Source {
  id: string;
  case_id: string;
  type: 'url' | 'image' | 'pdf' | 'text';
  url: string;
  title: string;
  label: SourceLabel;
  added_by: string;
  created_at: string;
}

export interface Subscription {
  user_id: string;
  case_id: string;
  mode: 'official_only' | 'all_activity';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  case_id: string;
  update_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'usr_01',
    handle: 'ravenworth',
    email: 'ravenworth@email.com',
    avatarInitials: 'RW',
    avatarColor: '#6366f1',
    trust_level: 5,
    created_at: '2024-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'usr_02',
    handle: 'meridian_kai',
    email: 'mkai@email.com',
    avatarInitials: 'MK',
    avatarColor: '#8b5cf6',
    trust_level: 4,
    created_at: '2024-02-10T08:30:00Z',
    status: 'active',
  },
  {
    id: 'usr_03',
    handle: 'solene_v',
    email: 'solene@email.com',
    avatarInitials: 'SV',
    avatarColor: '#06b6d4',
    trust_level: 3,
    created_at: '2024-03-05T14:00:00Z',
    status: 'active',
  },
  {
    id: 'usr_04',
    handle: 'phoenix_docs',
    email: 'phoenix@email.com',
    avatarInitials: 'PD',
    avatarColor: '#f59e0b',
    trust_level: 5,
    created_at: '2023-12-01T09:00:00Z',
    status: 'active',
  },
  {
    id: 'current_user',
    handle: 'you',
    email: 'you@caseatlas.com',
    avatarInitials: 'YO',
    avatarColor: '#6366f1',
    trust_level: 3,
    created_at: '2024-04-01T00:00:00Z',
    status: 'active',
  },
];

// ─── Mock Cases ───────────────────────────────────────────────────────────────

export const MOCK_CASES: Case[] = [
  {
    id: 'case_internal_01',
    case_id: 'CA-7M2K-P9QF',
    title: 'Missing: Arya Menon, Kochi – Last Seen Near Marine Drive',
    summary:
      'Arya Menon, 24, was last seen on the night of March 12, 2024 near Marine Drive, Kochi. She left home at approximately 8:45 PM to meet a friend and never arrived. Her phone was last active near the Marine Drive promenade area at 9:17 PM. Family has filed an FIR. Welfare check requests ongoing.',
    category: 'missing_person',
    location_text: 'Marine Drive, Kochi, Kerala, India',
    incident_start_date: '2024-03-12',
    incident_end_date: null,
    status: 'open',
    visibility: 'public',
    tags: ['missing', 'kochi', 'kerala', 'urgent'],
    created_by: 'usr_01',
    moderators: ['usr_01', 'usr_02'],
    created_at: '2024-03-13T06:00:00Z',
    updated_at: '2024-04-10T11:00:00Z',
    subscriber_count: 1847,
    comment_count: 312,
    update_count: 8,
  },
  {
    id: 'case_internal_02',
    case_id: 'CA-3R8T-W1VX',
    title: 'Online Investment Scam – "GrowthEdge Capital" Platform',
    summary:
      'Multiple users report losing significant sums to a platform operating under the name "GrowthEdge Capital". The platform uses social media ads, promises 300%+ returns, and subsequently vanishes after collecting funds. Over 200 reported victims across India.',
    category: 'scam',
    location_text: 'Online (India-wide)',
    incident_start_date: '2023-11-01',
    incident_end_date: '2024-01-20',
    status: 'open',
    visibility: 'public',
    tags: ['scam', 'investment', 'fraud', 'online'],
    created_by: 'usr_04',
    moderators: ['usr_04'],
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-03-28T08:00:00Z',
    subscriber_count: 3291,
    comment_count: 891,
    update_count: 14,
  },
  {
    id: 'case_internal_03',
    case_id: 'CA-9KN2-F5LM',
    title: 'Hit-and-Run Incident – Outer Ring Road, Bangalore, Jan 2024',
    summary:
      'A motorcyclist was struck by a speeding vehicle on the Outer Ring Road near Marathahalli, Bangalore on January 8, 2024 at approximately 11:30 PM. The vehicle fled the scene. A partial number plate was captured on a nearby CCTV camera.',
    category: 'accident',
    location_text: 'Outer Ring Road, Marathahalli, Bangalore, Karnataka',
    incident_start_date: '2024-01-08',
    incident_end_date: '2024-01-08',
    status: 'resolved',
    visibility: 'public',
    tags: ['hit-and-run', 'bangalore', 'traffic', 'cctv'],
    created_by: 'usr_03',
    moderators: ['usr_03'],
    created_at: '2024-01-09T07:00:00Z',
    updated_at: '2024-02-15T14:00:00Z',
    subscriber_count: 742,
    comment_count: 198,
    update_count: 5,
  },
  {
    id: 'case_internal_04',
    case_id: 'CA-2P6Q-H8RN',
    title: 'Workplace Harassment Complaint – TechVenture Startup, Mumbai',
    summary:
      'Multiple former employees of a Mumbai-based seed-stage startup have reported a pattern of systemic workplace harassment by senior management. Complaints involve gender-based discrimination, hostile work environment, and retaliation against whistleblowers.',
    category: 'harassment',
    location_text: 'Lower Parel, Mumbai, Maharashtra, India',
    incident_start_date: '2023-06-01',
    incident_end_date: null,
    status: 'open',
    visibility: 'unlisted',
    tags: ['harassment', 'workplace', 'mumbai', 'startup'],
    created_by: 'usr_02',
    moderators: ['usr_02', 'usr_01'],
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-04-05T15:00:00Z',
    subscriber_count: 156,
    comment_count: 89,
    update_count: 3,
  },
  {
    id: 'case_internal_05',
    case_id: 'CA-5Y7A-C3MZ',
    title: 'Municipal Corruption Allegation – BBMP Ward 84, Water Supply Diversion',
    summary:
      'Residents of Ward 84 in Bangalore allege that funds earmarked for water pipeline repairs were siphoned off. Multiple RTI requests have been filed. Internal documents shared anonymously suggest procurement irregularities.',
    category: 'corruption',
    location_text: 'Ward 84, BBMP, Bangalore, Karnataka',
    incident_start_date: '2023-09-01',
    incident_end_date: null,
    status: 'open',
    visibility: 'public',
    tags: ['corruption', 'municipal', 'bangalore', 'rti'],
    created_by: 'usr_04',
    moderators: ['usr_04'],
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-03-12T10:00:00Z',
    subscriber_count: 2104,
    comment_count: 445,
    update_count: 11,
  },
];

// ─── Mock Updates ─────────────────────────────────────────────────────────────

export const MOCK_UPDATES: Record<string, Update[]> = {
  'case_internal_01': [
    {
      id: 'upd_01a',
      case_id: 'case_internal_01',
      author_id: 'usr_01',
      type: 'official_update',
      title: 'Police confirm search operation extended to backwater areas',
      body: 'As per an official statement from the Ernakulam District Police, the search and rescue operation has been extended to include the backwater areas near Marine Drive. Coast Guard teams have been deployed. The family has confirmed that Arya had no prior history of self-harm or runaway incidents.',
      state: 'approved',
      approved_by: 'usr_01',
      approved_at: '2024-04-10T11:00:00Z',
      created_at: '2024-04-10T10:30:00Z',
    },
    {
      id: 'upd_01b',
      case_id: 'case_internal_01',
      author_id: 'usr_02',
      type: 'official_update',
      title: 'CCTV footage review: new last-seen location identified',
      body: 'Volunteers reviewing CCTV footage from Marine Drive establishments have identified what appears to be Arya at a tea stall on Banerjee Road at 9:02 PM — approximately 15 minutes after she left home. She was seen speaking to an unidentified individual. This footage has been shared with the police.',
      state: 'approved',
      approved_by: 'usr_01',
      approved_at: '2024-03-20T14:00:00Z',
      created_at: '2024-03-20T13:00:00Z',
    },
    {
      id: 'upd_01c',
      case_id: 'case_internal_01',
      author_id: 'usr_01',
      type: 'status_change',
      title: 'FIR filed; case registered under IPC Section 346',
      body: 'Family has confirmed that an FIR has been formally registered at the Fort Kochi Police Station. The case number is 00412/2024. The family requests anyone with information to call the Kerala Police helpline: 1091.',
      state: 'approved',
      approved_by: 'usr_01',
      approved_at: '2024-03-14T10:00:00Z',
      created_at: '2024-03-13T16:00:00Z',
    },
  ],
  'case_internal_02': [
    {
      id: 'upd_02a',
      case_id: 'case_internal_02',
      author_id: 'usr_04',
      type: 'official_update',
      title: 'Cybercrime cell registers FIR; domain seized',
      body: 'The Mumbai Cybercrime Cell has confirmed that an FIR has been registered against the operators of GrowthEdge Capital. The primary domain (growthedgecapital.in) has been seized and is now showing a government notice. Victims are encouraged to file individual complaints at their nearest cybercrime cell.',
      state: 'approved',
      approved_by: 'usr_04',
      approved_at: '2024-03-28T08:00:00Z',
      created_at: '2024-03-27T15:00:00Z',
    },
  ],
};

// ─── Mock Comments ────────────────────────────────────────────────────────────

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  'case_internal_01': [
    {
      id: 'cmt_01a',
      case_id: 'case_internal_01',
      user_id: 'usr_03',
      parent_comment_id: null,
      body: `I was at Marine Drive that evening around 9 PM. I did see a young woman near the park area who seemed distressed. I didn't think much of it at the time. I've shared my contact details with the police.`,
      state: 'visible',
      upvotes: 47,
      created_at: '2024-03-14T08:00:00Z',
      replies: [
        {
          id: 'cmt_01a_r1',
          case_id: 'case_internal_01',
          user_id: 'usr_01',
          parent_comment_id: 'cmt_01a',
          body: 'Thank you for coming forward. Please contact Fort Kochi PS directly at the number in the update. This is crucial information.',
          state: 'visible',
          upvotes: 32,
          created_at: '2024-03-14T08:45:00Z',
        },
      ],
    },
    {
      id: 'cmt_01b',
      case_id: 'case_internal_01',
      user_id: 'usr_02',
      parent_comment_id: null,
      body: 'Sharing to all local Kochi community groups. Please also circulate in WhatsApp groups — the more people who see this, the better.',
      state: 'visible',
      upvotes: 28,
      created_at: '2024-03-13T18:00:00Z',
      replies: [],
    },
    {
      id: 'cmt_01c',
      case_id: 'case_internal_01',
      user_id: 'usr_04',
      parent_comment_id: null,
      body: 'Has anyone checked with the auto-rickshaw drivers who operate the Marine Drive stretch? They often notice unusual things late at night.',
      state: 'visible',
      upvotes: 19,
      created_at: '2024-03-15T10:00:00Z',
      replies: [],
    },
  ],
  'case_internal_02': [
    {
      id: 'cmt_02a',
      case_id: 'case_internal_02',
      user_id: 'usr_03',
      parent_comment_id: null,
      body: 'I lost ₹85,000 to these scammers. They had very professional-looking certificates and a live chat on the website. Everything appeared legitimate until withdrawal was refused.',
      state: 'visible',
      upvotes: 156,
      created_at: '2024-01-26T09:00:00Z',
      replies: [],
    },
  ],
};

// ─── Mock Sources ─────────────────────────────────────────────────────────────

export const MOCK_SOURCES: Record<string, Source[]> = {
  'case_internal_01': [
    {
      id: 'src_01a',
      case_id: 'case_internal_01',
      type: 'url',
      url: 'https://www.thehindu.com/news/national/kerala/',
      title: 'The Hindu – Kerala coverage on the case',
      label: 'news_article',
      added_by: 'usr_01',
      created_at: '2024-03-14T09:00:00Z',
    },
    {
      id: 'src_01b',
      case_id: 'case_internal_01',
      type: 'text',
      url: '#',
      title: 'FIR Copy – Fort Kochi PS / Case No. 00412/2024',
      label: 'police_report',
      added_by: 'usr_01',
      created_at: '2024-03-14T10:00:00Z',
    },
    {
      id: 'src_01c',
      case_id: 'case_internal_01',
      type: 'url',
      url: '#',
      title: 'Family statement shared on social media (Instagram)',
      label: 'personal_account',
      added_by: 'usr_02',
      created_at: '2024-03-13T20:00:00Z',
    },
  ],
  'case_internal_02': [
    {
      id: 'src_02a',
      case_id: 'case_internal_02',
      type: 'url',
      url: '#',
      title: 'Cybercrime FIR confirmation – Cybercrime.gov.in portal',
      label: 'official_document',
      added_by: 'usr_04',
      created_at: '2024-01-26T11:00:00Z',
    },
  ],
};

// ─── Mock Subscriptions (current user) ───────────────────────────────────────

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { user_id: 'current_user', case_id: 'case_internal_01', mode: 'official_only', created_at: '2024-03-15T00:00:00Z' },
  { user_id: 'current_user', case_id: 'case_internal_02', mode: 'official_only', created_at: '2024-01-28T00:00:00Z' },
  { user_id: 'current_user', case_id: 'case_internal_05', mode: 'all_activity', created_at: '2024-01-12T00:00:00Z' },
];

// ─── Mock Notifications ────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    user_id: 'current_user',
    case_id: 'case_internal_01',
    update_id: 'upd_01a',
    title: 'Official Update: CA-7M2K-P9QF',
    body: 'Police confirm search operation extended to backwater areas',
    read: false,
    created_at: '2024-04-10T11:00:00Z',
  },
  {
    id: 'notif_02',
    user_id: 'current_user',
    case_id: 'case_internal_02',
    update_id: 'upd_02a',
    title: 'Official Update: CA-3R8T-W1VX',
    body: 'Cybercrime cell registers FIR; domain seized',
    read: false,
    created_at: '2024-03-28T08:00:00Z',
  },
  {
    id: 'notif_03',
    user_id: 'current_user',
    case_id: 'case_internal_01',
    update_id: 'upd_01b',
    title: 'Official Update: CA-7M2K-P9QF',
    body: 'CCTV footage review: new last-seen location identified',
    read: true,
    created_at: '2024-03-20T14:00:00Z',
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getAllCases(): Case[] {
  if (typeof window === 'undefined') return MOCK_CASES;
  const stored = localStorage.getItem('caseatlas_cases');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('caseatlas_cases', JSON.stringify(MOCK_CASES));
  return MOCK_CASES;
}

export function saveCase(newCase: Case) {
  const current = getAllCases();
  const updated = [newCase, ...current];
  localStorage.setItem('caseatlas_cases', JSON.stringify(updated));
}

export function getCaseById(caseId: string): Case | undefined {
  return getAllCases().find(c => c.case_id === caseId || c.id === caseId);
}

export function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find(u => u.id === userId);
}

export function getUpdatesForCase(caseInternalId: string): Update[] {
  const customUpdatesStr = typeof window !== 'undefined' ? localStorage.getItem(`caseatlas_updates_${caseInternalId}`) : null;
  const customUpdates: Update[] = customUpdatesStr ? JSON.parse(customUpdatesStr) : [];
  const defaultUpdates = (MOCK_UPDATES[caseInternalId] || []).filter(u => u.state === 'approved');
  
  // Combine custom updates and mock updates, sort by date
  return [...customUpdates, ...defaultUpdates].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function saveUpdate(caseInternalId: string, update: Update) {
  const currentStr = localStorage.getItem(`caseatlas_updates_${caseInternalId}`);
  const current: Update[] = currentStr ? JSON.parse(currentStr) : [];
  localStorage.setItem(`caseatlas_updates_${caseInternalId}`, JSON.stringify([update, ...current]));
  
  // Actually update the case update_count
  const allCases = getAllCases();
  const targetIndex = allCases.findIndex(c => c.id === caseInternalId);
  if (targetIndex >= 0) {
    allCases[targetIndex].update_count += 1;
    localStorage.setItem('caseatlas_cases', JSON.stringify(allCases));
  }
}

export function getCommentsForCase(caseInternalId: string): Comment[] {
  return MOCK_COMMENTS[caseInternalId] || [];
}

export function getSourcesForCase(caseInternalId: string): Source[] {
  return MOCK_SOURCES[caseInternalId] || [];
}

export function isSubscribed(caseInternalId: string): boolean {
  return MOCK_SUBSCRIPTIONS.some(s => s.case_id === caseInternalId);
}

export function getSubscribedCases(): Case[] {
  const subIds = MOCK_SUBSCRIPTIONS.map(s => s.case_id);
  return getAllCases().filter(c => subIds.includes(c.id));
}

export function getCategoryLabel(cat: CaseCategory): string {
  const labels: Record<CaseCategory, string> = {
    missing_person: 'Missing Person',
    crime: 'Crime',
    harassment: 'Harassment',
    scam: 'Scam / Fraud',
    accident: 'Accident',
    corruption: 'Corruption',
    other: 'Other',
  };
  return labels[cat];
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function generateCaseId(): string {
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford Base32
  const rand = () => chars[Math.floor(Math.random() * chars.length)];
  const seg = (n: number) => Array.from({ length: n }, rand).join('');
  return `CA-${seg(4)}-${seg(4)}`;
}

export const SOURCE_LABEL_META: Record<SourceLabel, { label: string; color: string; reliability: string }> = {
  police_report:    { label: 'Police Report', color: '#6366f1', reliability: 'Official' },
  news_article:     { label: 'News Article', color: '#3b82f6', reliability: 'Media' },
  official_document:{ label: 'Official Document', color: '#8b5cf6', reliability: 'Verified' },
  personal_account: { label: 'Personal Account', color: '#f59e0b', reliability: 'Unverified' },
  social_post:      { label: 'Social Post', color: '#6b7280', reliability: 'Low reliability' },
  other:            { label: 'Other', color: '#6b7280', reliability: 'Unknown' },
};
