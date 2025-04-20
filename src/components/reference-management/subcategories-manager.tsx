
import { useState } from "react";
import { useCashFlow } from "@/context/cash-flow-context";
import { Subcategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SubcategoriesManager() {
  const { referenceData, addSubcategory, updateSubcategory, deleteSubcategory } = useCashFlow();
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) {
      setError("Название подкатегории не может быть пустым");
      return;
    }

    if (!newSubcategoryCategoryId) {
      setError("Необходимо выбрать категорию");
      return;
    }

    if (
      referenceData.subcategories.some(
        subcategory => 
          subcategory.name.toLowerCase() === newSubcategoryName.trim().toLowerCase() &&
          subcategory.categoryId === newSubcategoryCategoryId
      )
    ) {
      setError("Подкатегория с таким названием уже существует для данной категории");
      return;
    }

    addSubcategory({ 
      name: newSubcategoryName.trim(),
      categoryId: newSubcategoryCategoryId
    });
    setNewSubcategoryName("");
    setNewSubcategoryCategoryId("");
    setError(null);
  };

  const handleUpdateSubcategory = () => {
    if (!editingSubcategory || !editingSubcategory.name.trim()) {
      setError("Название подкатегории не может быть пустым");
      return;
    }

    if (!editingSubcategory.categoryId) {
      setError("Необходимо выбрать категорию");
      return;
    }

    if (
      referenceData.subcategories.some(
        subcategory => 
          subcategory.id !== editingSubcategory.id && 
          subcategory.name.toLowerCase() === editingSubcategory.name.trim().toLowerCase() &&
          subcategory.categoryId === editingSubcategory.categoryId
      )
    ) {
      setError("Подкатегория с таким названием уже существует для данной категории");
      return;
    }

    updateSubcategory(editingSubcategory.id, { 
      name: editingSubcategory.name.trim(),
      categoryId: editingSubcategory.categoryId
    });
    setEditingSubcategory(null);
    setError(null);
  };

  const handleDeleteSubcategory = (id: string) => {
    deleteSubcategory(id);
    setError(null);
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = referenceData.categories.find(category => category.id === categoryId);
    return category ? category.name : "—";
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 flex-col sm:flex-row">
        <Input
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          placeholder="Новая подкатегория"
          className="sm:flex-1"
        />
        <Select
          value={newSubcategoryCategoryId}
          onValueChange={setNewSubcategoryCategoryId}
        >
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {referenceData.categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddSubcategory}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referenceData.subcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>
                {editingSubcategory?.id === subcategory.id ? (
                  <Input
                    value={editingSubcategory.name}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                    autoFocus
                  />
                ) : (
                  subcategory.name
                )}
              </TableCell>
              <TableCell>
                {editingSubcategory?.id === subcategory.id ? (
                  <Select
                    value={editingSubcategory.categoryId}
                    onValueChange={(value) => setEditingSubcategory({ ...editingSubcategory, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {referenceData.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  getCategoryName(subcategory.categoryId)
                )}
              </TableCell>
              <TableCell>
                {editingSubcategory?.id === subcategory.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleUpdateSubcategory}>Сохранить</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingSubcategory(null)}>Отмена</Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingSubcategory(subcategory)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {referenceData.subcategories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
