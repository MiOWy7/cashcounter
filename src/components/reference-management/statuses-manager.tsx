
import { useState } from "react";
import { useCashFlow } from "@/context/cash-flow-context";
import { Status } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StatusesManager() {
  const { referenceData, addStatus, updateStatus, deleteStatus } = useCashFlow();
  const [newStatusName, setNewStatusName] = useState("");
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddStatus = () => {
    if (!newStatusName.trim()) {
      setError("Название статуса не может быть пустым");
      return;
    }

    if (referenceData.statuses.some(status => status.name.toLowerCase() === newStatusName.trim().toLowerCase())) {
      setError("Статус с таким названием уже существует");
      return;
    }

    addStatus({ name: newStatusName.trim() });
    setNewStatusName("");
    setError(null);
  };

  const handleUpdateStatus = () => {
    if (!editingStatus || !editingStatus.name.trim()) {
      setError("Название статуса не может быть пустым");
      return;
    }

    if (
      referenceData.statuses.some(
        status => 
          status.id !== editingStatus.id && 
          status.name.toLowerCase() === editingStatus.name.trim().toLowerCase()
      )
    ) {
      setError("Статус с таким названием уже существует");
      return;
    }

    updateStatus(editingStatus.id, { name: editingStatus.name.trim() });
    setEditingStatus(null);
    setError(null);
  };

  const handleDeleteStatus = (id: string) => {
    deleteStatus(id);
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
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
          placeholder="Новый статус"
        />
        <Button onClick={handleAddStatus}>
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
          {referenceData.statuses.map((status) => (
            <TableRow key={status.id}>
              <TableCell>
                {editingStatus?.id === status.id ? (
                  <Input
                    value={editingStatus.name}
                    onChange={(e) => setEditingStatus({ ...editingStatus, name: e.target.value })}
                    autoFocus
                  />
                ) : (
                  status.name
                )}
              </TableCell>
              <TableCell>
                {editingStatus?.id === status.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleUpdateStatus}>Сохранить</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingStatus(null)}>Отмена</Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingStatus(status)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteStatus(status.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {referenceData.statuses.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
