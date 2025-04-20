
import { CashFlowForm } from "@/components/cash-flow-form";

const CreateEntry = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Создание новой записи</h1>
        <p className="text-muted-foreground">Заполните форму для создания новой записи о движении денежных средств</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <CashFlowForm />
      </div>
    </div>
  );
};

export default CreateEntry;
