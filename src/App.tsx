import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Onboarding Pages
import OnboardingWelcome from "./pages/onboarding/Welcome";
import OnboardingCompany from "./pages/onboarding/Company";
import OnboardingWhatsApp from "./pages/onboarding/WhatsApp";
import OnboardingBranding from "./pages/onboarding/Branding";
import OnboardingPlan from "./pages/onboarding/Plan";

// Integrator Dashboard Pages
import DashboardHome from "./pages/dashboard/Home";
import DashboardLeads from "./pages/dashboard/Leads";
import DashboardKits from "./pages/dashboard/Kits";
import DashboardChatbot from "./pages/dashboard/Chatbot";
import DashboardFlows from "./pages/dashboard/Flows";
import DashboardSettings from "./pages/dashboard/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminIntegrators from "./pages/admin/Integrators";
import AdminLicenses from "./pages/admin/Licenses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
          <Route path="/onboarding/company" element={<OnboardingCompany />} />
          <Route path="/onboarding/whatsapp" element={<OnboardingWhatsApp />} />
          <Route path="/onboarding/branding" element={<OnboardingBranding />} />
          <Route path="/onboarding/plan" element={<OnboardingPlan />} />

          {/* Integrator Dashboard Routes */}
          <Route path="/dashboard/home" element={<DashboardHome />} />
          <Route path="/dashboard/leads" element={<DashboardLeads />} />
          <Route path="/dashboard/kits" element={<DashboardKits />} />
          <Route path="/dashboard/chatbot" element={<DashboardChatbot />} />
          <Route path="/dashboard/flows" element={<DashboardFlows />} />
          <Route path="/dashboard/account" element={<DashboardHome />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/integrators" element={<AdminIntegrators />} />
          <Route path="/admin/financeiro" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;