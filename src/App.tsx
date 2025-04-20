
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CashFlowProvider } from "@/context/cash-flow-context";
import HomePage from "./pages/index"; // Corrected import
import CreateEntry from "./pages/create";
import EditEntry from "./pages/edit";
import References from "./pages/references";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CashFlowProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateEntry />} />
            <Route path="/edit/:id" element={<EditEntry />} />
            <Route path="/references" element={<References />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CashFlowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
