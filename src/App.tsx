import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
import AdminPricing from "./pages/admin/Pricing";

// Public White-Label Page
import WhiteLabelPage from "./pages/public/WhiteLabelPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Onboarding Routes (requires auth) */}
            <Route path="/onboarding/welcome" element={<ProtectedRoute><OnboardingWelcome /></ProtectedRoute>} />
            <Route path="/onboarding/company" element={<ProtectedRoute><OnboardingCompany /></ProtectedRoute>} />
            <Route path="/onboarding/whatsapp" element={<ProtectedRoute><OnboardingWhatsApp /></ProtectedRoute>} />
            <Route path="/onboarding/branding" element={<ProtectedRoute><OnboardingBranding /></ProtectedRoute>} />
            <Route path="/onboarding/plan" element={<ProtectedRoute><OnboardingPlan /></ProtectedRoute>} />

            {/* Integrator Dashboard Routes */}
            <Route path="/dashboard/home" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/dashboard/leads" element={<ProtectedRoute><DashboardLeads /></ProtectedRoute>} />
            <Route path="/dashboard/kits" element={<ProtectedRoute><DashboardKits /></ProtectedRoute>} />
            <Route path="/dashboard/chatbot" element={<ProtectedRoute><DashboardChatbot /></ProtectedRoute>} />
            <Route path="/dashboard/flows" element={<ProtectedRoute><DashboardFlows /></ProtectedRoute>} />
            <Route path="/dashboard/account" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/integrators" element={<ProtectedRoute requiredRole="admin"><AdminIntegrators /></ProtectedRoute>} />
            <Route path="/admin/licenses" element={<ProtectedRoute requiredRole="admin"><AdminLicenses /></ProtectedRoute>} />
            <Route path="/admin/financeiro" element={<ProtectedRoute requiredRole="admin"><AdminPricing /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* White-Label Public Pages */}
            <Route path="/s/:slug" element={<WhiteLabelPage />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
