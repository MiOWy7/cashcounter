
import { useState } from "react";
import { useCashFlow } from "@/context/cash-flow-context";
import { TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function TypesManager() {
  const { referenceData, addType, updateType, deleteType } = useCashFlow();
  const [newTypeName, setNewTypeName] = useState("");
  const [editingType, setEditingType] = useState<TransactionType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddType = () => {
    if (!newTypeName.trim()) {
      setError("Название типа не может быть пустым");
      return;
    }

    if (referenceData.types.some(type => type.name.toLowerCase() === newTypeName.trim().toLowerCase())) {
      setError("Тип с таким названием уже существует");
      return;
    }

    addType({ name: newTypeName.trim() });
    setNewTypeName("");
    setError(null);
  };

  const handleUpdateType = () => {
    if (!editingType || !editingType.name.trim()) {
      setError("Название типа не может быть пустым");
      return;
    }

    if (
      referenceData.types.some(
        type => 
          type.id !== editingType.id && 
          type.name.toLowerCase() === editingType.name.trim().toLowerCase()
      )
    ) {
      setError("Тип с таким названием уже существует");
      return;
    }

    updateType(editingType.id, { name: editingType.name.trim() });
    setEditingType(null);
    setError(null);
  };

  const handleDeleteType = (id: string) => {
    // Check if there are any categories using this type
    const hasCategories = referenceData.categories.some(category => category.typeId === id);
    
    if (hasCategories) {
      setError("Невозможно удалить тип, так как с ним связаны категории");
      return;
    }
    
    deleteType(id);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="Новый тип"
        />
        <Button onClick={handleAddType}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referenceData.types.map((type) => (
            <TableRow key={type.id}>
              <TableCell>
                {editingType?.id === type.id ? (
                  <Input
                    value={editingType.name}
                    onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                    autoFocus
                  />
                ) : (
                  type.name
                )}
              </TableCell>
              <TableCell>
                {editingType?.id === type.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleUpdateType}>Сохранить</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingType(null)}>Отмена</Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingType(type)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteType(type.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {referenceData.types.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
