
export type Status = {
  id: string;
  name: string;
};

export type TransactionType = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  typeId: string; // Associated transaction type
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string; // Associated category
};

export type CashFlowEntry = {
  id: string;
  date: Date;
  statusId: string;
  typeId: string;
  categoryId: string;
  subcategoryId: string;
  amount: number;
  comment?: string;
  createdAt: Date;
};

export type ReferenceData = {
  statuses: Status[];
  types: TransactionType[];
  categories: Category[];
  subcategories: Subcategory[];
};
