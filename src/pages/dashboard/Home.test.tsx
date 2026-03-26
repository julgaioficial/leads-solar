import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardHome from "./Home";
import * as supabaseModule from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(),
    },
  },
}));

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the DashboardLayout
vi.mock("@/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("DashboardHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dashboard home page", () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      auth: {
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      },
    };

    vi.spyOn(supabaseModule, "supabase", "get").mockReturnValue(mockSupabase as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardHome />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Olá, João!/)).toBeInTheDocument();
  });

  it("displays the white-label link when integrator exists", async () => {
    const mockIntegrator = {
      id: "123",
      user_id: "user-123",
      slug: "solar-energy-ltda",
      company_name: "Solar Energy Ltda",
      active: true,
    };

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: mockIntegrator, error: null })),
          })),
        })),
      })),
      auth: {
        onAuthStateChange: vi.fn((callback) => {
          callback("SIGNED_IN", {
            user: { id: "user-123" },
          });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "user-123" } } },
          })
        ),
      },
    };

    vi.spyOn(supabaseModule, "supabase", "get").mockReturnValue(mockSupabase as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardHome />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Seu Link Exclusivo")).toBeInTheDocument();
    });

    expect(screen.getByText(/solar-energy-ltda/)).toBeInTheDocument();
  });

  it("displays the onboarding message when integrator does not exist", async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      auth: {
        onAuthStateChange: vi.fn((callback) => {
          callback("SIGNED_IN", {
            user: { id: "user-123" },
          });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "user-123" } } },
          })
        ),
      },
    };

    vi.spyOn(supabaseModule, "supabase", "get").mockReturnValue(mockSupabase as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardHome />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Complete seu cadastro")).toBeInTheDocument();
    });

    expect(screen.getByText(/Complete seu cadastro para ativar seu site/)).toBeInTheDocument();
  });

  it("displays the copy link button when integrator exists", async () => {
    const mockIntegrator = {
      id: "123",
      user_id: "user-123",
      slug: "solar-energy-ltda",
      company_name: "Solar Energy Ltda",
      active: true,
    };

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: mockIntegrator, error: null })),
          })),
        })),
      })),
      auth: {
        onAuthStateChange: vi.fn((callback) => {
          callback("SIGNED_IN", {
            user: { id: "user-123" },
          });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "user-123" } } },
          })
        ),
      },
    };

    vi.spyOn(supabaseModule, "supabase", "get").mockReturnValue(mockSupabase as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardHome />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Copiar Link/i })).toBeInTheDocument();
    });
  });

  it("displays the onboarding button when integrator does not exist", async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      auth: {
        onAuthStateChange: vi.fn((callback) => {
          callback("SIGNED_IN", {
            user: { id: "user-123" },
          });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { session: { user: { id: "user-123" } } },
          })
        ),
      },
    };

    vi.spyOn(supabaseModule, "supabase", "get").mockReturnValue(mockSupabase as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardHome />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Ir para Onboarding/i })).toBeInTheDocument();
    });
  });
});
