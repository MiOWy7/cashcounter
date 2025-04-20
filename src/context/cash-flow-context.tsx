
import { createContext, useContext, useState, ReactNode } from "react";
import { 
  CashFlowEntry, 
  Category, 
  ReferenceData, 
  Status, 
  Subcategory, 
  TransactionType 
} from "@/types";
import { generateId, initialCashFlowEntries, initialReferenceData } from "@/lib/data";

interface CashFlowContextType {
  // Data
  entries: CashFlowEntry[];
  referenceData: ReferenceData;
  
  // Cash flow entry operations
  addEntry: (entry: Omit<CashFlowEntry, "id" | "createdAt">) => void;
  updateEntry: (id: string, entry: Partial<CashFlowEntry>) => void;
  deleteEntry: (id: string) => void;
  
  // Reference data operations
  addStatus: (status: Omit<Status, "id">) => void;
  updateStatus: (id: string, status: Partial<Status>) => void;
  deleteStatus: (id: string) => void;
  
  addType: (type: Omit<TransactionType, "id">) => void;
  updateType: (id: string, type: Partial<TransactionType>) => void;
  deleteType: (id: string) => void;
  
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addSubcategory: (subcategory: Omit<Subcategory, "id">) => void;
  updateSubcategory: (id: string, subcategory: Partial<Subcategory>) => void;
  deleteSubcategory: (id: string) => void;
  
  // Helper functions
  getSubcategoriesByCategory: (categoryId: string) => Subcategory[];
  getCategoriesByType: (typeId: string) => Category[];
}

const CashFlowContext = createContext<CashFlowContextType | undefined>(undefined);

export function CashFlowProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CashFlowEntry[]>(initialCashFlowEntries);
  const [referenceData, setReferenceData] = useState<ReferenceData>(initialReferenceData);

  // Cash flow entry operations
  const addEntry = (entry: Omit<CashFlowEntry, "id" | "createdAt">) => {
    const newEntry: CashFlowEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date(),
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, entry: Partial<CashFlowEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...entry } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Reference data operations
  const addStatus = (status: Omit<Status, "id">) => {
    const newStatus: Status = { ...status, id: generateId() };
    setReferenceData({
      ...referenceData,
      statuses: [...referenceData.statuses, newStatus],
    });
  };

  const updateStatus = (id: string, status: Partial<Status>) => {
    setReferenceData({
      ...referenceData,
      statuses: referenceData.statuses.map(s => s.id === id ? { ...s, ...status } : s),
    });
  };

  const deleteStatus = (id: string) => {
    setReferenceData({
      ...referenceData,
      statuses: referenceData.statuses.filter(s => s.id !== id),
    });
  };

  const addType = (type: Omit<TransactionType, "id">) => {
    const newType: TransactionType = { ...type, id: generateId() };
    setReferenceData({
      ...referenceData,
      types: [...referenceData.types, newType],
    });
  };

  const updateType = (id: string, type: Partial<TransactionType>) => {
    setReferenceData({
      ...referenceData,
      types: referenceData.types.map(t => t.id === id ? { ...t, ...type } : t),
    });
  };

  const deleteType = (id: string) => {
    setReferenceData({
      ...referenceData,
      types: referenceData.types.filter(t => t.id !== id),
    });
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = { ...category, id: generateId() };
    setReferenceData({
      ...referenceData,
      categories: [...referenceData.categories, newCategory],
    });
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setReferenceData({
      ...referenceData,
      categories: referenceData.categories.map(c => c.id === id ? { ...c, ...category } : c),
    });
  };

  const deleteCategory = (id: string) => {
    setReferenceData({
      ...referenceData,
      categories: referenceData.categories.filter(c => c.id !== id),
    });
  };

  const addSubcategory = (subcategory: Omit<Subcategory, "id">) => {
    const newSubcategory: Subcategory = { ...subcategory, id: generateId() };
    setReferenceData({
      ...referenceData,
      subcategories: [...referenceData.subcategories, newSubcategory],
    });
  };

  const updateSubcategory = (id: string, subcategory: Partial<Subcategory>) => {
    setReferenceData({
      ...referenceData,
      subcategories: referenceData.subcategories.map(s => s.id === id ? { ...s, ...subcategory } : s),
    });
  };

  const deleteSubcategory = (id: string) => {
    setReferenceData({
      ...referenceData,
      subcategories: referenceData.subcategories.filter(s => s.id !== id),
    });
  };

  // Helper functions
  const getSubcategoriesByCategory = (categoryId: string) => {
    return referenceData.subcategories.filter(s => s.categoryId === categoryId);
  };

  const getCategoriesByType = (typeId: string) => {
    return referenceData.categories.filter(c => c.typeId === typeId);
  };

  return (
    <CashFlowContext.Provider
      value={{
        entries,
        referenceData,
        addEntry,
        updateEntry,
        deleteEntry,
        addStatus,
        updateStatus,
        deleteStatus,
        addType,
        updateType,
        deleteType,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        getSubcategoriesByCategory,
        getCategoriesByType,
      }}
    >
      {children}
    </CashFlowContext.Provider>
  );
}

export function useCashFlow() {
  const context = useContext(CashFlowContext);
  if (context === undefined) {
    throw new Error("useCashFlow must be used within a CashFlowProvider");
  }
  return context;
}
