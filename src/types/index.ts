import { DateRange as DayPickerDateRange } from "react-day-picker";

export type DateRange = DayPickerDateRange;

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  cpf: string;
  birthDate: string;
  source: string;
  vehicleOfInterest: string;
  paymentMethod: "cash" | "trade" | "financing";
  tradeInfo?: {
    model: string;
    year: string;
    km: string;
    downPayment: string;
  };
  financingInfo?: {
    downPayment: string;
  };
  notes: string;
  status: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  leadIds: string[];
}

export interface Message {
  id: string;
  leadId: string;
  content: string;
  type: "text" | "audio" | "file" | "image";
  fileUrl?: string;
  isIncoming: boolean;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface Channel {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface DashboardFilter {
  period: "today" | "yesterday" | "last7days" | "last14days" | "last30days" | "custom";
  startDate?: string;
  endDate?: string;
  channelIds: string[];
}

export interface DashboardStats {
  newLeads: number;
  inProgressLeads: number;
  completedLeads: number;
  funnelData: {
    columnName: string;
    count: number;
  }[];
}

export type PaymentMethod = "cash" | "trade" | "financing";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent";
  avatar?: string;
}
