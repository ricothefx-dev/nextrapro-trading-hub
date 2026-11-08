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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bots: {
        Row: {
          created_at: string
          ea_token: string
          id: string
          image_url: string | null
          mentor_id: string
          name: string
        }
        Insert: {
          created_at?: string
          ea_token?: string
          id?: string
          image_url?: string | null
          mentor_id?: string
          name: string
        }
        Update: {
          created_at?: string
          ea_token?: string
          id?: string
          image_url?: string | null
          mentor_id?: string
          name?: string
        }
        Relationships: []
      }
      client_mt5_connections: {
        Row: {
          broker_name: string | null
          client_id: string
          connection_status: string
          created_at: string
          id: string
          last_heartbeat: string | null
          mt5_account_number: string | null
          unique_connection_code: string
          updated_at: string
        }
        Insert: {
          broker_name?: string | null
          client_id: string
          connection_status?: string
          created_at?: string
          id?: string
          last_heartbeat?: string | null
          mt5_account_number?: string | null
          unique_connection_code?: string
          updated_at?: string
        }
        Update: {
          broker_name?: string | null
          client_id?: string
          connection_status?: string
          created_at?: string
          id?: string
          last_heartbeat?: string | null
          mt5_account_number?: string | null
          unique_connection_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      licences: {
        Row: {
          activated_at: string | null
          bot_id: string
          copy_enabled: boolean
          created_at: string
          customer_name: string | null
          expires_at: string | null
          id: string
          licence_key: string
          max_trades_day: number
          mentor_id: string
          revoked: boolean
          risk_mode: string
          risk_value: number
        }
        Insert: {
          activated_at?: string | null
          bot_id: string
          copy_enabled?: boolean
          created_at?: string
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          licence_key?: string
          max_trades_day?: number
          mentor_id?: string
          revoked?: boolean
          risk_mode?: string
          risk_value?: number
        }
        Update: {
          activated_at?: string | null
          bot_id?: string
          copy_enabled?: boolean
          created_at?: string
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          licence_key?: string
          max_trades_day?: number
          mentor_id?: string
          revoked?: boolean
          risk_mode?: string
          risk_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "licences_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_accounts: {
        Row: {
          connection_status: string
          created_at: string
          provider_id: string
          provider_name: string
          unique_ea_code: string
          updated_at: string
        }
        Insert: {
          connection_status?: string
          created_at?: string
          provider_id: string
          provider_name: string
          unique_ea_code?: string
          updated_at?: string
        }
        Update: {
          connection_status?: string
          created_at?: string
          provider_id?: string
          provider_name?: string
          unique_ea_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          action: string
          bot_id: string
          created_at: string
          id: number
          mentor_id: string
          price: number | null
          side: string | null
          sl: number | null
          symbol: string
          ticket: number
          tp: number | null
          volume: number | null
        }
        Insert: {
          action: string
          bot_id: string
          created_at?: string
          id?: number
          mentor_id: string
          price?: number | null
          side?: string | null
          sl?: number | null
          symbol: string
          ticket: number
          tp?: number | null
          volume?: number | null
        }
        Update: {
          action?: string
          bot_id?: string
          created_at?: string
          id?: number
          mentor_id?: string
          price?: number | null
          side?: string | null
          sl?: number | null
          symbol?: string
          ticket?: number
          tp?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "signals_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_executions: {
        Row: {
          client_id: string
          client_ticket: number | null
          created_at: string
          error_message: string | null
          execution_status: string
          execution_timestamp: string | null
          id: string
          signal_id: number
        }
        Insert: {
          client_id: string
          client_ticket?: number | null
          created_at?: string
          error_message?: string | null
          execution_status?: string
          execution_timestamp?: string | null
          id?: string
          signal_id: number
        }
        Update: {
          client_id?: string
          client_ticket?: number | null
          created_at?: string
          error_message?: string | null
          execution_status?: string
          execution_timestamp?: string | null
          id?: string
          signal_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trade_executions_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "trade_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_signals: {
        Row: {
          action: string
          created_at: string
          direction: string
          entry_price: number | null
          id: number
          lot_size: number
          master_ticket: number
          provider_id: string
          stop_loss: number | null
          symbol: string
          take_profit: number | null
        }
        Insert: {
          action: string
          created_at?: string
          direction: string
          entry_price?: number | null
          id?: number
          lot_size: number
          master_ticket: number
          provider_id: string
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
        }
        Update: {
          action?: string
          created_at?: string
          direction?: string
          entry_price?: number | null
          id?: number
          lot_size?: number
          master_ticket?: number
          provider_id?: string
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_signals_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_accounts"
            referencedColumns: ["provider_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      activate_licence: {
        Args: { _key: string }
        Returns: {
          bot_image: string
          bot_name: string
          expires_at: string
        }[]
      }
      has_app_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      licence_copy_status: {
        Args: { _key: string }
        Returns: {
          copy_enabled: boolean
          max_trades_day: number
          recent: Json
          risk_mode: string
          risk_value: number
        }[]
      }
      set_licence_risk: {
        Args: {
          _enabled: boolean
          _key: string
          _max: number
          _mode: string
          _value: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "provider" | "client"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "provider", "client"],
    },
  },
} as const
