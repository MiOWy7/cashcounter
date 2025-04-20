
import { CashFlowEntry, Category, ReferenceData, Status, Subcategory, TransactionType } from "@/types";

// Initial reference data
export const initialReferenceData: ReferenceData = {
  statuses: [
    { id: "business", name: "Бизнес" },
    { id: "personal", name: "Личное" },
    { id: "tax", name: "Налог" },
  ],
  types: [
    { id: "income", name: "Пополнение" },
    { id: "expense", name: "Списание" },
  ],
  categories: [
    { id: "infrastructure", name: "Инфраструктура", typeId: "expense" },
    { id: "marketing", name: "Маркетинг", typeId: "expense" },
    { id: "salary", name: "Зарплата", typeId: "income" },
    { id: "sales", name: "Продажи", typeId: "income" },
  ],
  subcategories: [
    { id: "vps", name: "VPS", categoryId: "infrastructure" },
    { id: "proxy", name: "Proxy", categoryId: "infrastructure" },
    { id: "farpost", name: "Farpost", categoryId: "marketing" },
    { id: "avito", name: "Avito", categoryId: "marketing" },
    { id: "regular", name: "Регулярные", categoryId: "salary" },
    { id: "bonus", name: "Бонусы", categoryId: "salary" },
    { id: "services", name: "Услуги", categoryId: "sales" },
    { id: "products", name: "Товары", categoryId: "sales" },
  ],
};

// Initial cash flow entries
export const initialCashFlowEntries: CashFlowEntry[] = [
  {
    id: "1",
    date: new Date(2025, 0, 1), // January 1, 2025
    statusId: "business",
    typeId: "expense",
    categoryId: "infrastructure",
    subcategoryId: "vps",
    amount: 5000,
    comment: "Оплата хостинга",
    createdAt: new Date(2025, 0, 1),
  },
  {
    id: "2",
    date: new Date(2025, 0, 5), // January 5, 2025
    statusId: "business",
    typeId: "expense",
    categoryId: "marketing",
    subcategoryId: "avito",
    amount: 3000,
    comment: "Реклама на Авито",
    createdAt: new Date(2025, 0, 5),
  },
  {
    id: "3",
    date: new Date(2025, 0, 10), // January 10, 2025
    statusId: "personal",
    typeId: "income",
    categoryId: "salary",
    subcategoryId: "regular",
    amount: 50000,
    comment: "Зарплата за декабрь",
    createdAt: new Date(2025, 0, 10),
  },
  {
    id: "4",
    date: new Date(2025, 0, 15), // January 15, 2025
    statusId: "business",
    typeId: "income",
    categoryId: "sales",
    subcategoryId: "services",
    amount: 25000,
    comment: "Оплата за консультацию",
    createdAt: new Date(2025, 0, 15),
  },
  {
    id: "5",
    date: new Date(2025, 0, 20), // January 20, 2025
    statusId: "tax",
    typeId: "expense",
    categoryId: "infrastructure",
    subcategoryId: "proxy",
    amount: 7500,
    comment: "Налоговые отчисления",
    createdAt: new Date(2025, 0, 20),
  },
];

// Helper function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Format amount as currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU').format(date);
}

// Get entity by ID from an array
export function getItemById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Get filtered subcategories by category ID
export function getSubcategoriesByCategoryId(subcategories: Subcategory[], categoryId: string): Subcategory[] {
  return subcategories.filter(subcategory => subcategory.categoryId === categoryId);
}

// Get filtered categories by type ID
export function getCategoriesByTypeId(categories: Category[], typeId: string): Category[] {
  return categories.filter(category => category.typeId === typeId);
}
