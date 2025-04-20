
import { Button } from "@/components/ui/button";
import { CashFlowTable } from "@/components/cash-flow-table";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление движением денежных средств</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/create">
              <PlusIcon className="h-4 w-4 mr-1" />
              Новая запись
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/references">
              Управление справочниками
            </Link>
          </Button>
        </div>
      </div>
      
      <CashFlowTable />
    </div>
  );
};

export default Index;
