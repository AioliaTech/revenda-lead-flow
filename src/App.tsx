
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import KanbanPage from "./pages/Kanban";
import ChatPage from "./pages/Chat";
import LeadsPage from "./pages/Leads";
import TagsPage from "./pages/Tags";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);

export default App;
