import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "integrator" | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: UserRole;
  integratorId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  integratorId: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [integratorId, setIntegratorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    setRole((data?.role as UserRole) || "integrator");
  };

  const fetchIntegratorId = async (userId: string) => {
    const { data } = await supabase
      .from("integrators")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    setIntegratorId(data?.id || null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(async () => {
            await fetchUserRole(session.user.id);
            await fetchIntegratorId(session.user.id);
            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setIntegratorId(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchIntegratorId(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    setIntegratorId(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, integratorId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
