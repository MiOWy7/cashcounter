
import { useState } from "react";
import { useCashFlow } from "@/context/cash-flow-context";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CategoriesManager() {
  const { referenceData, addCategory, updateCategory, deleteCategory } = useCashFlow();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryTypeId, setNewCategoryTypeId] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError("Название категории не может быть пустым");
      return;
    }

    if (!newCategoryTypeId) {
      setError("Необходимо выбрать тип");
      return;
    }

    if (
      referenceData.categories.some(
        category => 
          category.name.toLowerCase() === newCategoryName.trim().toLowerCase() &&
          category.typeId === newCategoryTypeId
      )
    ) {
      setError("Категория с таким названием уже существует для данного типа");
      return;
    }

    addCategory({ 
      name: newCategoryName.trim(),
      typeId: newCategoryTypeId
    });
    setNewCategoryName("");
    setNewCategoryTypeId("");
    setError(null);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      setError("Название категории не может быть пустым");
      return;
    }

    if (!editingCategory.typeId) {
      setError("Необходимо выбрать тип");
      return;
    }

    if (
      referenceData.categories.some(
        category => 
          category.id !== editingCategory.id && 
          category.name.toLowerCase() === editingCategory.name.trim().toLowerCase() &&
          category.typeId === editingCategory.typeId
      )
    ) {
      setError("Категория с таким названием уже существует для данного типа");
      return;
    }

    updateCategory(editingCategory.id, { 
      name: editingCategory.name.trim(),
      typeId: editingCategory.typeId
    });
    setEditingCategory(null);
    setError(null);
  };

  const handleDeleteCategory = (id: string) => {
    // Check if there are any subcategories using this category
    const hasSubcategories = referenceData.subcategories.some(subcategory => subcategory.categoryId === id);
    
    if (hasSubcategories) {
      setError("Невозможно удалить категорию, так как с ней связаны подкатегории");
      return;
    }
    
    deleteCategory(id);
    setError(null);
  };

  // Get type name by ID
  const getTypeName = (typeId: string) => {
    const type = referenceData.types.find(type => type.id === typeId);
    return type ? type.name : "—";
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
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Новая категория"
          className="sm:flex-1"
        />
        <Select
          value={newCategoryTypeId}
          onValueChange={setNewCategoryTypeId}
        >
          <SelectTrigger className="sm:w-[200px]">
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
        <Button onClick={handleAddCategory}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referenceData.categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {editingCategory?.id === category.id ? (
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    autoFocus
                  />
                ) : (
                  category.name
                )}
              </TableCell>
              <TableCell>
                {editingCategory?.id === category.id ? (
                  <Select
                    value={editingCategory.typeId}
                    onValueChange={(value) => setEditingCategory({ ...editingCategory, typeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {referenceData.types.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  getTypeName(category.typeId)
                )}
              </TableCell>
              <TableCell>
                {editingCategory?.id === category.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleUpdateCategory}>Сохранить</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>Отмена</Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingCategory(category)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {referenceData.categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
