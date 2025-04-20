
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusesManager } from "./statuses-manager";
import { TypesManager } from "./types-manager";
import { CategoriesManager } from "./categories-manager";
import { SubcategoriesManager } from "./subcategories-manager";

export function ReferenceTabs() {
  const [activeTab, setActiveTab] = useState("statuses");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="statuses">Статусы</TabsTrigger>
        <TabsTrigger value="types">Типы</TabsTrigger>
        <TabsTrigger value="categories">Категории</TabsTrigger>
        <TabsTrigger value="subcategories">Подкатегории</TabsTrigger>
      </TabsList>
      <TabsContent value="statuses">
        <StatusesManager />
      </TabsContent>
      <TabsContent value="types">
        <TypesManager />
      </TabsContent>
      <TabsContent value="categories">
        <CategoriesManager />
      </TabsContent>
      <TabsContent value="subcategories">
        <SubcategoriesManager />
      </TabsContent>
    </Tabs>
  );
}
