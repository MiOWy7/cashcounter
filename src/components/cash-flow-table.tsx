
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

import { formatCurrency, formatDate } from "@/lib/data";
import { useCashFlow } from "@/context/cash-flow-context";
import { CashFlowEntry } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CashFlowTable() {
  const { entries, referenceData, deleteEntry } = useCashFlow();
  const navigate = useNavigate();

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | undefined>(undefined);

  // Get categories based on selected type
  const filteredCategories = typeFilter
    ? referenceData.categories.filter(category => category.typeId === typeFilter)
    : referenceData.categories;

  // Get subcategories based on selected category
  const filteredSubcategories = categoryFilter
    ? referenceData.subcategories.filter(subcategory => subcategory.categoryId === categoryFilter)
    : referenceData.subcategories;

  // Apply filters to entries
  const filteredEntries = entries.filter(entry => {
    // Date range filter
    if (dateRange?.from && entry.date < dateRange.from) return false;
    if (dateRange?.to && entry.date > dateRange.to) return false;
    
    // Status filter
    if (statusFilter && entry.statusId !== statusFilter) return false;
    
    // Type filter
    if (typeFilter && entry.typeId !== typeFilter) return false;
    
    // Category filter
    if (categoryFilter && entry.categoryId !== categoryFilter) return false;
    
    // Subcategory filter
    if (subcategoryFilter && entry.subcategoryId !== subcategoryFilter) return false;
    
    return true;
  });

  // Define table columns
  const columns: ColumnDef<CashFlowEntry>[] = [
    {
      accessorKey: "date",
      header: "Дата",
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: "statusId",
      header: "Статус",
      cell: ({ row }) => {
        const status = referenceData.statuses.find(s => s.id === row.original.statusId);
        return <Badge variant="outline">{status?.name || "Неизвестно"}</Badge>;
      },
    },
    {
      accessorKey: "typeId",
      header: "Тип",
      cell: ({ row }) => {
        const type = referenceData.types.find(t => t.id === row.original.typeId);
        const isIncome = type?.id === "income";
        return (
          <Badge className={isIncome ? "bg-income" : "bg-expense"}>
            {type?.name || "Неизвестно"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "categoryId",
      header: "Категория",
      cell: ({ row }) => {
        const category = referenceData.categories.find(c => c.id === row.original.categoryId);
        return category?.name || "Неизвестно";
      },
    },
    {
      accessorKey: "subcategoryId",
      header: "Подкатегория",
      cell: ({ row }) => {
        const subcategory = referenceData.subcategories.find(s => s.id === row.original.subcategoryId);
        return subcategory?.name || "Неизвестно";
      },
    },
    {
      accessorKey: "amount",
      header: "Сумма",
      cell: ({ row }) => {
        const type = referenceData.types.find(t => t.id === row.original.typeId);
        const isIncome = type?.id === "income";
        return (
          <span className={isIncome ? "text-income" : "text-expense"}>
            {formatCurrency(row.original.amount)}
          </span>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Комментарий",
      cell: ({ row }) => row.original.comment || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Открыть меню</span>
                <EditIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/edit/${row.original.id}`)}>
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => deleteEntry(row.original.id)}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Reset all filters
  const resetFilters = () => {
    setDateRange(undefined);
    setStatusFilter(undefined);
    setTypeFilter(undefined);
    setCategoryFilter(undefined);
    setSubcategoryFilter(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Фильтры</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Все статусы</SelectItem>
              {referenceData.statuses.map(status => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => {
            setTypeFilter(value);
            setCategoryFilter(undefined);
            setSubcategoryFilter(undefined);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Все типы</SelectItem>
              {referenceData.types.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={categoryFilter} 
            onValueChange={(value) => {
              setCategoryFilter(value);
              setSubcategoryFilter(undefined);
            }}
            disabled={!typeFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Все категории</SelectItem>
              {filteredCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={subcategoryFilter} 
            onValueChange={setSubcategoryFilter}
            disabled={!categoryFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все подкатегории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Все подкатегории</SelectItem>
              {filteredSubcategories.map(subcategory => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={filteredEntries} />
      </div>
    </div>
  );
}
