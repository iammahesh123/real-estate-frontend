export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  profileImage?: string;
  roles: string[];
  agentId?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  profileImage?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  roles: string[];
  agentId?: number;
  createdAt: string;
}

export interface PropertyType {
  id: number;
  name: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  description?: string;
  icon?: string;
  active: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  category: string;
  icon?: string;
  active: boolean;
}

export interface City {
  id: number;
  name: string;
  stateName: string;
  imageUrl?: string;
  featured: boolean;
}

export interface Locality {
  id: number;
  cityId: number;
  name: string;
  postalCode?: string;
}

export interface PropertyMedia {
  id: number;
  url: string;
  mediaType: string;
  displayOrder: number;
  primaryImage: boolean;
  altText?: string;
}

export interface PropertySummary {
  id: number;
  propertyCode: string;
  title: string;
  slug: string;
  listingType: 'SALE' | 'RENT' | 'LEASE';
  propertyTypeName: string;
  propertyType?: string;
  propertyStatus: string;
  status?: string;
  approvalStatus: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  areaUnit: string;
  furnishingStatus: string;
  possessionStatus: string;
  city: string;
  locality?: string;
  primaryImageUrl?: string;
  featured: boolean;
  verified: boolean;
  agentId?: number;
  agentName?: string;
  agentPhone?: string;
  agentWhatsapp?: string;
  createdAt: string;
}


export interface PropertyDetail {
  id: number;
  propertyCode: string;
  title: string;
  slug: string;
  description: string;
  listingType: 'SALE' | 'RENT' | 'LEASE';
  propertyTypeId: number;
  propertyTypeName: string;
  projectId?: number;
  projectName?: string;
  propertyStatus: string;
  approvalStatus: string;
  rejectionReason?: string;
  price: number;
  currency: string;
  pricePerSqft?: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  builtUpArea: number;
  carpetArea?: number;
  plotArea?: number;
  areaUnit: string;
  furnishingStatus: string;
  possessionStatus: string;
  propertyAge?: string;
  floorNumber: number;
  totalFloors: number;
  parkingSpaces: number;
  facing?: string;
  addressLine1: string;
  addressLine2?: string;
  localityId?: number;
  localityName?: string;
  cityId: number;
  cityName: string;
  stateId?: number;
  stateName?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  featured: boolean;
  verified: boolean;
  agent: {
    id: number;
    userId: number;
    name: string;
    agencyName?: string;
    licenseNumber?: string;
    bio?: string;
    yearsOfExperience: number;
    specialization?: string;
    profilePhoto?: string;
    phone?: string;
    whatsappNumber?: string;
    email?: string;
    rating: number;
    verified: boolean;
  };
  amenities: Amenity[];
  media: PropertyMedia[];
  primaryImageUrl?: string;
  createdAt: string;

  updatedAt: string;
  publishedAt?: string;
}

export interface AgentSummary {
  id: number;
  userId: number;
  name: string;
  agencyName?: string;
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience: number;
  profilePhoto?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  city?: string;
  rating: number;
  verified: boolean;
  activeListingsCount: number;
}

export interface AgentDetail {
  id: number;
  userId: number;
  name: string;
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
  yearsOfExperience: number;
  specialization?: string;
  profilePhoto?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  officeAddress?: string;
  city?: string;
  state?: string;
  rating: number;
  verified: boolean;
  properties: PropertySummary[];
}

export interface Project {
  id: number;
  name: string;
  developerName: string;
  description?: string;
  status: string;
  launchDate?: string;
  expectedCompletion?: string;
  address?: string;
  cityId?: number;
  cityName?: string;
  reraNumber?: string;
  minPrice?: number;
  maxPrice?: number;
  coverImage?: string;
}

export interface Enquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  propertyCity: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  source: string;
  status: string;
  assignedAgentId?: number;
  assignedAgentName?: string;
  createdAt: string;
}

export interface LeadNote {
  id: number;
  authorId: number;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface LeadStatusHistory {
  id: number;
  changedByName: string;
  oldStatus?: string;
  newStatus: string;
  remarks?: string;
  createdAt: string;
}

export interface Lead {
  id: number;
  enquiryId?: number;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  propertyCode: string;
  customerId?: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  assignedAgentId: number;
  assignedAgentName: string;
  leadSource: string;
  status: string;
  budget?: number;
  nextFollowUp?: string;
  notes: LeadNote[];
  history: LeadStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisit {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  propertyAddress: string;
  propertyCity: string;
  primaryImageUrl?: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  agentId: number;
  agentName: string;
  agentPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalProperties: number;
  activeProperties: number;
  pendingApprovals: number;
  soldProperties: number;
  rentedProperties: number;
  totalCustomers: number;
  totalAgents: number;
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  leadConversionRate: number;
  totalSiteVisits: number;
  upcomingVisits: number;
  propertiesByCategory: Record<string, number>;
  propertiesByCity: Record<string, number>;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
}

export interface AgentDashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalSiteVisits: number;
  pendingSiteVisits: number;
  conversionRate: number;
}

export interface CustomerDashboardStats {
  totalFavourites: number;
  totalEnquiries: number;
  totalVisits: number;
  upcomingVisits: number;
}
