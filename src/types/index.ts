export interface User {
  id: string;
  username: string;
}

export type BudgetTier = "murah" | "menengah-bawah" | "menengah-atas" | "mewah";

export interface Questionnaire {
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  budget: number;
  budgetTier: BudgetTier;
  selectedNecessities: string[];
}

export interface Todo {
  id: string;
  necessityId: string;
  title: string;
  pic: string;
  dueDate: string;
  status: "pending" | "in_progress" | "done";
  description: string;
  link: string;
}

export interface Vendor {
  id: string;
  necessityId: string;
  name: string;
  socialLinks: { platform: string; url: string }[];
  priority: number;
  budget: number;
  pros: string[];
  cons: string[];
  notes: string;
  isRecommended: boolean;
}

export interface Necessity {
  id: string;
  name: string;
  isDefault: boolean;
  todos: Todo[];
  vendors: Vendor[];
}

export interface GalleryItem {
  id: string;
  necessityId: string;
  link: string;
  description: string;
  type: "youtube" | "tiktok" | "image" | "other";
}

export interface Invoice {
  id: string;
  vendorId: string;
  vendorName: string;
  photoUrl: string;
  amount: number;
  notes: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  necessityId: string;
  necessityName: string;
  description: string;
}

export interface RecentActivity {
  id: string;
  necessityId: string;
  necessityName: string;
  action: string;
  createdAt: string;
}
