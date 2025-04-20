
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { useCashFlow } from "@/context/cash-flow-context";
import { CashFlowEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashFlowFormProps {
  initialData?: CashFlowEntry;
  isEditing?: boolean;
}

export function CashFlowForm({ initialData, isEditing = false }: CashFlowFormProps) {
  const navigate = useNavigate();
  const { referenceData, addEntry, updateEntry } = useCashFlow();
  
  // Form state
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [statusId, setStatusId] = useState<string | undefined>(initialData?.statusId);
  const [typeId, setTypeId] = useState<string | undefined>(initialData?.typeId);
  const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.categoryId);
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>(initialData?.subcategoryId);
  const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || "");
  const [comment, setComment] = useState<string>(initialData?.comment || "");
  
  // Filtered categories and subcategories based on selected type and category
  const [availableCategories, setAvailableCategories] = useState(referenceData.categories);
  const [availableSubcategories, setAvailableSubcategories] = useState(referenceData.subcategories);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update available categories when type changes
  useEffect(() => {
    if (typeId) {
      const filteredCategories = referenceData.categories.filter(
        category => category.typeId === typeId
      );
      setAvailableCategories(filteredCategories);
      
      // Reset category if current selection doesn't match the new type
      const currentCategoryMatchesType = filteredCategories.some(
        category => category.id === categoryId
      );
      
      if (!currentCategoryMatchesType) {
        setCategoryId(undefined);
        setSubcategoryId(undefined);
      }
    } else {
      setAvailableCategories([]);
      setCategoryId(undefined);
      setSubcategoryId(undefined);
    }
  }, [typeId, referenceData.categories]);
  
  // Update available subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      const filteredSubcategories = referenceData.subcategories.filter(
        subcategory => subcategory.categoryId === categoryId
      );
      setAvailableSubcategories(filteredSubcategories);
      
      // Reset subcategory if current selection doesn't match the new category
      const currentSubcategoryMatchesCategory = filteredSubcategories.some(
        subcategory => subcategory.id === subcategoryId
      );
      
      if (!currentSubcategoryMatchesCategory) {
        setSubcategoryId(undefined);
      }
    } else {
      setAvailableSubcategories([]);
      setSubcategoryId(undefined);
    }
  }, [categoryId, referenceData.subcategories]);

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!statusId) {
      newErrors.statusId = "Статус обязателен для заполнения";
    }
    
    if (!typeId) {
      newErrors.typeId = "Тип обязателен для заполнения";
    }
    
    if (!categoryId) {
      newErrors.categoryId = "Категория обязательна для заполнения";
    }
    
    if (!subcategoryId) {
      newErrors.subcategoryId = "Подкатегория обязательна для заполнения";
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Сумма должна быть положительным числом";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const entryData = {
      date,
      statusId: statusId!,
      typeId: typeId!,
      categoryId: categoryId!,
      subcategoryId: subcategoryId!,
      amount: parseFloat(amount),
      comment: comment || undefined,
    };
    
    if (isEditing && initialData) {
      updateEntry(initialData.id, entryData);
    } else {
      addEntry(entryData);
    }
    
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Дата</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd.MM.yyyy", { locale: ru }) : <span>Выберите дату</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Статус
              {errors.statusId && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={statusId} onValueChange={setStatusId}>
              <SelectTrigger className={cn(errors.statusId && "border-destructive")}>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {referenceData.statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.statusId && (
              <p className="text-destructive text-sm">{errors.statusId}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Тип
              {errors.typeId && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={typeId}
              onValueChange={(value) => {
                setTypeId(value);
              }}
            >
              <SelectTrigger className={cn(errors.typeId && "border-destructive")}>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {referenceData.types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.typeId && (
              <p className="text-destructive text-sm">{errors.typeId}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Категория
              {errors.categoryId && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={!typeId}
            >
              <SelectTrigger className={cn(errors.categoryId && "border-destructive")}>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-destructive text-sm">{errors.categoryId}</p>
            )}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">
              Подкатегория
              {errors.subcategoryId && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={subcategoryId}
              onValueChange={setSubcategoryId}
              disabled={!categoryId}
            >
              <SelectTrigger className={cn(errors.subcategoryId && "border-destructive")}>
                <SelectValue placeholder="Выберите подкатегорию" />
              </SelectTrigger>
              <SelectContent>
                {availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subcategoryId && (
              <p className="text-destructive text-sm">{errors.subcategoryId}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Сумма (в рублях)
              {errors.amount && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              className={cn(errors.amount && "border-destructive")}
              min="0.01"
              step="0.01"
            />
            {errors.amount && (
              <p className="text-destructive text-sm">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий (необязательно)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введите комментарий"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={() => navigate("/")}>
          Отмена
        </Button>
        <Button type="submit">
          {isEditing ? "Сохранить изменения" : "Создать запись"}
        </Button>
      </div>
    </form>
  );
}
