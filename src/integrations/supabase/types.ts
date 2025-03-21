export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      connected_wallets: {
        Row: {
          created_at: string
          email: string | null
          id: number
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          wallet_address: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          wallet_address?: string
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          auth_date: number | null
          created_at: string
          hash: string | null
          id: number
          telegram_first_name: string | null
          telegram_id: number
          telegram_last_name: string | null
          telegram_photo_url: string | null
          telegram_username: string | null
          wallet_address: string | null
        }
        Insert: {
          auth_date?: number | null
          created_at?: string
          hash?: string | null
          id?: number
          telegram_first_name?: string | null
          telegram_id: number
          telegram_last_name?: string | null
          telegram_photo_url?: string | null
          telegram_username?: string | null
          wallet_address?: string | null
        }
        Update: {
          auth_date?: number | null
          created_at?: string
          hash?: string | null
          id?: number
          telegram_first_name?: string | null
          telegram_id?: number
          telegram_last_name?: string | null
          telegram_photo_url?: string | null
          telegram_username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      user_wallet_links: {
        Row: {
          created_at: string
          id: number
          is_primary: boolean | null
          telegram_id: number | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_primary?: boolean | null
          telegram_id?: number | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_primary?: boolean | null
          telegram_id?: number | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_wallet_links_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      wallet_balances: {
        Row: {
          fipt_balance: number
          id: number
          last_updated: string
          points: number | null
          telegram_id: number | null
          wallet_address: string
        }
        Insert: {
          fipt_balance?: number
          id?: number
          last_updated?: string
          points?: number | null
          telegram_id?: number | null
          wallet_address: string
        }
        Update: {
          fipt_balance?: number
          id?: number
          last_updated?: string
          points?: number | null
          telegram_id?: number | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_balances_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
