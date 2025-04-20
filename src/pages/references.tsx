
import { ReferenceTabs } from "@/components/reference-management/reference-tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const References = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Назад
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Управление справочниками</h1>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <ReferenceTabs />
      </div>
    </div>
  );
};

export default References;
