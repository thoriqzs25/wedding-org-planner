export type AccountStatus = "active" | "inactive";

export interface Account {
  id: string;
  username: string;
  password: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  budget: number;
  budgetTier: BudgetTier;
  selectedWeddingElements: string[];
  guestCount: number;
  status: AccountStatus;
}

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
  guestCount: number;
  budget: number;
  budgetTier: BudgetTier;
  selectedWeddingElements: string[];
}

export interface Todo {
  id: string;
  weddingElementId: string;
  title: string;
  pic: string;
  dueDate: string;
  status: "pending" | "in_progress" | "done";
  description: string;
  link: string;
}

export interface VendorTask {
  id: string;
  title: string;
  done: boolean;
}

export interface VendorActivity {
  id: string;
  action: string;
  date: string;
}

export interface Vendor {
  id: string;
  weddingElementId: string;
  name: string;
  socialLinks: { platform: string; url: string }[];
  priority: number;
  budget: number;
  perPerson?: number;
  pros: string[];
  cons: string[];
  notes: string;
  isRecommended: boolean;
}

export type WeddingElementColor = "orange" | "pink" | "green" | "gold";

export interface WeddingElement {
  id: string;
  name: string;
  icon?: string;
  color?: WeddingElementColor;
  isDefault: boolean;
  todos: Todo[];
  vendors: Vendor[];
  selectedVendorId?: string;
  vendorTasks?: VendorTask[];
  vendorActivity?: VendorActivity[];
}

export interface GalleryItem {
  id: string;
  weddingElementId: string;
  link: string;
  description: string;
  type: "youtube" | "tiktok" | "image" | "other";
}

export interface Invoice {
  id: string;
  weddingElementId: string;
  weddingElementName: string;
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
  weddingElementId: string;
  weddingElementName: string;
  description: string;
  todoId?: string;
}

export type ActionType =
  | "todo_created"
  | "todo_completed"
  | "vendor_added"
  | "vendor_selected"
  | "vendor_deselected"
  | "vendor_task_completed"
  | "invoice_added"
  | "gallery_item_added"
  | "calendar_event_added";

export interface RecentActivity {
  id: string;
  weddingElementId: string;
  weddingElementName: string;
  action: string;
  actionType: ActionType;
  createdAt: string;
}
