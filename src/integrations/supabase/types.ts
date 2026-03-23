export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      budget_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          integrator_id: string
          lead_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          integrator_id: string
          lead_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          integrator_id?: string
          lead_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_transactions_integrator_id_fkey"
            columns: ["integrator_id"]
            isOneToOne: false
            referencedRelation: "integrators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          integrator_id: string
          lead_id: string
          messages: Json | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          integrator_id: string
          lead_id: string
          messages?: Json | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          integrator_id?: string
          lead_id?: string
          messages?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_integrator_id_fkey"
            columns: ["integrator_id"]
            isOneToOne: false
            referencedRelation: "integrators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_questions: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          integrator_id: string
          options: Json | null
          question_order: number
          question_text: string
          question_type: string
          required: boolean | null
          variable: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          integrator_id: string
          options?: Json | null
          question_order: number
          question_text: string
          question_type?: string
          required?: boolean | null
          variable: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          integrator_id?: string
          options?: Json | null
          question_order?: number
          question_text?: string
          question_type?: string
          required?: boolean | null
          variable?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_questions_integrator_id_fkey"
            columns: ["integrator_id"]
            isOneToOne: false
            referencedRelation: "integrators"
            referencedColumns: ["id"]
          },
        ]
      }
      integrators: {
        Row: {
          accent_color: string | null
          active: boolean | null
          address: string | null
          bot_name: string | null
          budget_reset_date: string | null
          budgets_used: number | null
          closing_message: string | null
          company_name: string
          created_at: string
          cta_text: string | null
          email: string | null
          favicon_url: string | null
          features: Json | null
          footer_text: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          license_id: string | null
          logo_url: string | null
          monthly_budget_limit: number | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          slug: string
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          testimonials: Json | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          accent_color?: string | null
          active?: boolean | null
          address?: string | null
          bot_name?: string | null
          budget_reset_date?: string | null
          budgets_used?: number | null
          closing_message?: string | null
          company_name: string
          created_at?: string
          cta_text?: string | null
          email?: string | null
          favicon_url?: string | null
          features?: Json | null
          footer_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          license_id?: string | null
          logo_url?: string | null
          monthly_budget_limit?: number | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          testimonials?: Json | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          accent_color?: string | null
          active?: boolean | null
          address?: string | null
          bot_name?: string | null
          budget_reset_date?: string | null
          budgets_used?: number | null
          closing_message?: string | null
          company_name?: string
          created_at?: string
          cta_text?: string | null
          email?: string | null
          favicon_url?: string | null
          features?: Json | null
          footer_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          license_id?: string | null
          logo_url?: string | null
          monthly_budget_limit?: number | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          testimonials?: Json | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrators_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      kits: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          install_price: number | null
          integrator_id: string
          inverter: string | null
          max_consumption: number
          min_consumption: number
          name: string
          panels: number
          power: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          install_price?: number | null
          integrator_id: string
          inverter?: string | null
          max_consumption?: number
          min_consumption?: number
          name: string
          panels: number
          power: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          install_price?: number | null
          integrator_id?: string
          inverter?: string | null
          max_consumption?: number
          min_consumption?: number
          name?: string
          panels?: number
          power?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kits_integrator_id_fkey"
            columns: ["integrator_id"]
            isOneToOne: false
            referencedRelation: "integrators"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          answers: Json | null
          city: string | null
          consumption_kwh: number | null
          converted: boolean | null
          created_at: string
          email: string | null
          id: string
          integrator_id: string
          monthly_bill: number | null
          name: string | null
          phone: string | null
          recommended_kit_id: string | null
          roof_type: string | null
          score: Database["public"]["Enums"]["lead_score"] | null
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          city?: string | null
          consumption_kwh?: number | null
          converted?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          integrator_id: string
          monthly_bill?: number | null
          name?: string | null
          phone?: string | null
          recommended_kit_id?: string | null
          roof_type?: string | null
          score?: Database["public"]["Enums"]["lead_score"] | null
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          city?: string | null
          consumption_kwh?: number | null
          converted?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          integrator_id?: string
          monthly_bill?: number | null
          name?: string | null
          phone?: string | null
          recommended_kit_id?: string | null
          roof_type?: string | null
          score?: Database["public"]["Enums"]["lead_score"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_integrator_id_fkey"
            columns: ["integrator_id"]
            isOneToOne: false
            referencedRelation: "integrators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_recommended_kit_id_fkey"
            columns: ["recommended_kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          assigned_to: string | null
          created_at: string
          expires_at: string | null
          id: string
          license_key: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["license_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["license_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["license_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_license_key: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "integrator"
      lead_score: "hot" | "warm" | "cold"
      license_status: "active" | "expired" | "revoked" | "trial"
      subscription_plan: "basic" | "pro"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "canceled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "integrator"],
      lead_score: ["hot", "warm", "cold"],
      license_status: ["active", "expired", "revoked", "trial"],
      subscription_plan: ["basic", "pro"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "canceled",
        "expired",
      ],
    },
  },
} as const
