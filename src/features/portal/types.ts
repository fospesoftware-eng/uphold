export type TenantPortalRole = 'tenant' | 'manager' | 'admin';

export interface TenantPortalUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  unitId: string;
  propertyId: string;
  role: TenantPortalRole;
  joinedAt: string;
}

export interface TenantUnit {
  id: string;
  tenantId: string;
  unitNumber: string;
  floor: string;
  building: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  city: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parking: string;
  storage: string;
  moveInDate: string;
  leaseStart: string;
  leaseEnd: string;
  deposit: number;
  rentAmount: number;
  rentDueDay: number;
  outstandingBalance: number;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  emergencyPhone: string;
  amenities: string[];
  leaseStatus: 'active' | 'expiring_soon' | 'expired' | 'notice_given';
  photos: string[];
  floorPlanUrl?: string;
  features: string[];
}

export interface PortalAsset {
  id: string;
  tenantId: string;
  assetCode: string;
  name: string;
  category: string;
  categoryIcon: string;
  description: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  warrantyExpiry?: string;
  installationDate?: string;
  status: 'working' | 'needs_service' | 'reported_issue' | 'out_of_service';
  lastService?: string;
  nextService?: string;
  qrCode: string;
  color?: string;
}

export type TicketStatus =
  | 'submitted' | 'acknowledged' | 'assigned' | 'in_progress'
  | 'waiting_for_parts' | 'resolved' | 'closed' | 'reopened';

export type TicketCategory =
  | 'maintenance' | 'electrical' | 'plumbing' | 'furniture' | 'cleaning'
  | 'security' | 'internet' | 'noise' | 'parking' | 'billing' | 'other';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketUpdate {
  id: string;
  author: string;
  authorRole: 'tenant' | 'staff' | 'technician';
  message: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface MaintenanceTicket {
  id: string;
  tenantId: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location?: string;
  relatedAssetId?: string;
  relatedAssetName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  estimatedResolution?: string;
  updates: TicketUpdate[];
  rating?: number;
  feedback?: string;
}

export interface PortalPayment {
  id: string;
  tenantId: string;
  type: 'rent' | 'deposit' | 'utility' | 'parking' | 'maintenance_charge' | 'late_fee' | 'refund';
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'upcoming' | 'cancelled';
  method?: 'card' | 'bank_transfer' | 'direct_debit' | 'housing_benefit';
  reference?: string;
  invoiceNumber?: string;
}

export interface PortalDocument {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  category: 'lease' | 'inspection' | 'invoice' | 'policy' | 'manual' | 'certificate' | 'checklist' | 'other';
  uploadedAt: string;
  expiryDate?: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'jpg' | 'png';
  status: 'current' | 'expiring_soon' | 'expired' | 'pending_signature' | 'signed';
  signatureRequired: boolean;
  signed: boolean;
  version: number;
  description?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'emergency' | 'maintenance' | 'event' | 'news' | 'utility_shutdown' | 'rules';
  priority: 'normal' | 'high' | 'urgent';
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  readBy: string[];
  author: string;
  authorRole: string;
  tags?: string[];
}

export interface VisitorPass {
  id: string;
  tenantId: string;
  visitorName: string;
  visitorPhone?: string;
  visitDate: string;
  visitTime: string;
  visitEndTime?: string;
  purpose: string;
  vehicleReg?: string;
  parkingSlot?: string;
  status: 'pending' | 'approved' | 'checked_in' | 'completed' | 'cancelled';
  qrCode: string;
  createdAt: string;
  notes?: string;
}

export interface Parcel {
  id: string;
  tenantId: string;
  trackingNumber: string;
  courier: string;
  description: string;
  weight?: string;
  sender?: string;
  receivedAt: string;
  collectedAt?: string;
  status: 'pending_collection' | 'collected' | 'returned';
  notificationSent: boolean;
  collectionCode: string;
  location: string;
  notes?: string;
}

export interface UtilityMonth {
  month: string;
  electricity: number; // kWh
  water: number; // m3
  gas: number; // m3
  electricityCost: number;
  waterCost: number;
  gasCost: number;
  total: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderName: string;
  senderRole: 'tenant' | 'manager' | 'maintenance' | 'accounts' | 'security' | 'reception';
  content: string;
  timestamp: string;
  read: boolean;
  isOwn?: boolean;
}

export interface Conversation {
  id: string;
  tenantId: string;
  recipientName: string;
  recipientRole: Message['senderRole'];
  subject: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isArchived: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'social' | 'meeting' | 'class' | 'sport' | 'celebration';
  organizer: string;
  maxAttendees?: number;
  registeredCount: number;
  isRegistered: boolean;
  imageColor: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
