// ── Organisation ────────────────────────────────────────────────────────────
export type PlanTier = 'starter' | 'professional' | 'enterprise';
export type OrgStatus = 'active' | 'suspended' | 'trial';

export interface Organisation {
  id: string;
  name: string;
  plan: PlanTier;
  activeUsers: number;
  tenantCount: number;
  occupantLimit: number;
  paymentStatus: 'paid' | 'overdue' | 'pending';
  renewalDate: string;
  status: OrgStatus;
  logoUrl?: string;
  lastAccessed?: string;
}

// ── User / Auth ──────────────────────────────────────────────────────────────
export type UserRole = 'super_admin' | 'admin' | 'support_staff' | 'board';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organisationId: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  status: 'active' | 'inactive' | 'pending';
}

// ── Tenant ───────────────────────────────────────────────────────────────────
export type TenantStatus = 'active' | 'pending' | 'moved_on' | 'at_risk';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type SupportLevel = 'low' | 'medium' | 'high' | 'intensive';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Tenant {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  status: TenantStatus;
  propertyId: string;
  roomNumber: string;
  keyWorkerId: string;
  tenancyStartDate: string;
  tenancyEndDate?: string;
  supportLevel: SupportLevel;
  riskLevel: RiskLevel;
  localAuthority: string;
  referralSource: string;
  nationalInsuranceNumber?: string;
  emergencyContact: EmergencyContact;
  supportHoursWeek: number;
  supportHoursRequired: number;
  rentAmount: number;
  rentBalance: number;
  housingBenefitStatus: 'confirmed' | 'pending' | 'not_claimed';
  lastContactDate: string;
  nextReviewDate: string;
  avatarUrl?: string;
  notes?: string;
}

// ── Property ─────────────────────────────────────────────────────────────────
export type PropertyType = 'supported_living' | 'shared_house' | 'self_contained' | 'move_on';
export type PropertyStatus = 'active' | 'inactive' | 'maintenance';

export interface Property {
  id: string;
  organisationId: string;
  address: string;
  city: string;
  postcode: string;
  type: PropertyType;
  totalRooms: number;
  occupiedRooms: number;
  status: PropertyStatus;
  assignedStaffIds: string[];
  lastInspectionDate: string;
  nextInspectionDate: string;
  localAuthority: string;
  region: string;
  imageUrl?: string;
}

// ── Room ─────────────────────────────────────────────────────────────────────
export type RoomStatus = 'occupied' | 'vacant' | 'pending' | 'maintenance' | 'unavailable';

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  status: RoomStatus;
  currentTenantId?: string;
  supportLevel?: SupportLevel;
  moveInDate?: string;
  weeklyRent: number;
  notes?: string;
}

// ── Certificate ──────────────────────────────────────────────────────────────
export type CertType =
  | 'gas_safety'
  | 'fire_safety'
  | 'electrical_eicr'
  | 'buildings_insurance'
  | 'hmo_licence'
  | 'epc'
  | 'pat_testing'
  | 'legionella';

export type ComplianceStatus = 'valid' | 'expiring_soon' | 'expired' | 'missing';

export interface Certificate {
  id: string;
  propertyId: string;
  type: CertType;
  issueDate: string;
  expiryDate: string;
  status: ComplianceStatus;
  documentUrl?: string;
  notes?: string;
}

// ── Support ──────────────────────────────────────────────────────────────────
export type SupportType =
  | 'housing_support'
  | 'benefits_support'
  | 'health_wellbeing'
  | 'employment_training'
  | 'safeguarding'
  | 'independent_living'
  | 'crisis_support'
  | 'tenancy_sustainment';

export interface SupportLog {
  id: string;
  tenantId: string;
  keyWorkerId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  supportType: SupportType;
  location: string;
  notes: string;
  tags: string[];
  outcome: string;
  followUpRequired: boolean;
  nextFollowUpDate?: string;
}

// ── STAR Assessment ──────────────────────────────────────────────────────────
export type StarStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export interface StarSection {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  notes: string;
}

export interface StarAssessment {
  id: string;
  tenantId: string;
  keyWorkerId: string;
  scheduledDate: string;
  completedDate?: string;
  status: StarStatus;
  sections: StarSection[];
  overallScore: number;
  notes?: string;
  draftSaved?: boolean;
}

// ── Financials ───────────────────────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'part_paid' | 'written_off';
export type PaymentMethod = 'direct_debit' | 'housing_benefit' | 'bank_transfer' | 'cash' | 'card';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  period: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  date: string;
  type: 'rent' | 'deposit' | 'refund' | 'arrears' | 'housing_benefit';
  amount: number;
  method: PaymentMethod;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

// ── Documents ────────────────────────────────────────────────────────────────
export type DocType =
  | 'tenancy_agreement'
  | 'support_plan'
  | 'risk_assessment'
  | 'consent_form'
  | 'id_verification'
  | 'local_authority_referral'
  | 'benefit_confirmation'
  | 'move_in_checklist';

export type DocStatus = 'complete' | 'missing' | 'expired' | 'pending_signature' | 'signed';
export type SignatureStatus = 'pending' | 'signed' | 'rejected' | 'expired' | 'not_required';

export interface TenantDocument {
  id: string;
  tenantId: string;
  type: DocType;
  name: string;
  status: DocStatus;
  signatureStatus: SignatureStatus;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  version: number;
  fileSize?: string;
  fileUrl?: string;
}

export type TemplateType =
  | 'tenancy_agreement'
  | 'notice'
  | 'letter'
  | 'support_plan'
  | 'risk_assessment'
  | 'consent_form'
  | 'review_letter';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  body: string;
  lastUpdated: string;
  createdBy: string;
}

// ── Reports ──────────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  lastGenerated?: string;
  generatedBy?: string;
  status: 'ready' | 'generating' | 'error';
}

// ── Notifications ────────────────────────────────────────────────────────────
export type NotificationSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  link?: string;
  tenantId?: string;
  propertyId?: string;
}

// ── Activity ─────────────────────────────────────────────────────────────────
export type ActivityEventType =
  | 'login'
  | 'upload'
  | 'support_log'
  | 'tenant_change'
  | 'payment'
  | 'certificate_update'
  | 'assessment_update';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  userId: string;
  userName: string;
  userAvatar?: string;
  description: string;
  timestamp: string;
  tenantId?: string;
  propertyId?: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardKPI {
  occupancyRate: number;
  activeTenants: number;
  tenantsAtRisk: number;
  belowSupportThreshold: number;
  certificatesValid: number;
  certificatesExpiringSoon: number;
  certificatesExpired: number;
  rentCollected: number;
  rentExpected: number;
  missingDocuments: number;
  starAssessmentsOverdue: number;
  openMaintenanceItems: number;
}

// ── License ───────────────────────────────────────────────────────────────────
export interface LicensePlan {
  id: string;
  name: PlanTier;
  seatCount: number;
  occupantLimit: number;
  modules: string[];
  monthlyPrice: number;
  renewalDate: string;
  billingStatus: 'active' | 'overdue' | 'cancelled';
}
