
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CashFlowForm } from "@/components/cash-flow-form";
import { useCashFlow } from "@/context/cash-flow-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries } = useCashFlow();
  const [entryToEdit, setEntryToEdit] = useState(entries.find(entry => entry.id === id));

  useEffect(() => {
    if (!id || !entries.some(entry => entry.id === id)) {
      navigate("/", { replace: true });
    }
  }, [id, entries, navigate]);

  if (!entryToEdit) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Запись не найдена. Вы будете перенаправлены на главную страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Редактирование записи</h1>
        <p className="text-muted-foreground">Измените данные записи о движении денежных средств</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <CashFlowForm initialData={entryToEdit} isEditing={true} />
      </div>
    </div>
  );
};

export default EditEntry;
