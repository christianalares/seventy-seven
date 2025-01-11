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
      integrations_slack: {
        Row: {
          created_at: string
          id: string
          slack_access_token: string
          slack_bot_user_id: string
          slack_channel: string
          slack_channel_id: string
          slack_configuration_url: string
          slack_team_id: string
          slack_team_name: string
          slack_url: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          slack_access_token: string
          slack_bot_user_id: string
          slack_channel: string
          slack_channel_id: string
          slack_configuration_url: string
          slack_team_id: string
          slack_team_name: string
          slack_url: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          slack_access_token?: string
          slack_bot_user_id?: string
          slack_channel?: string
          slack_channel_id?: string
          slack_configuration_url?: string
          slack_team_id?: string
          slack_team_name?: string
          slack_url?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_slack_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          email_id: string | null
          handler_id: string | null
          id: string
          sent_from_avatar_url: string | null
          sent_from_email: string | null
          sent_from_full_name: string | null
          ticket_id: string
          unable_to_parse_content: boolean
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string
          email_id?: string | null
          handler_id?: string | null
          id?: string
          sent_from_avatar_url?: string | null
          sent_from_email?: string | null
          sent_from_full_name?: string | null
          ticket_id: string
          unable_to_parse_content?: boolean
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          email_id?: string | null
          handler_id?: string | null
          id?: string
          sent_from_avatar_url?: string | null
          sent_from_email?: string | null
          sent_from_full_name?: string | null
          ticket_id?: string
          unable_to_parse_content?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_handler_id_fkey"
            columns: ["handler_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          code: string
          created_at: string
          created_by_user_id: string
          email: string
          id: string
          team_id: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by_user_id: string
          email: string
          id?: string
          team_id: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by_user_id?: string
          email?: string
          id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          auth_token: string | null
          created_at: string
          id: string
          image_url: string | null
          is_personal: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          auth_token?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_personal?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          auth_token?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_personal?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tags_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_tags_on_tickets: {
        Row: {
          created_at: string
          tag_id: string
          ticket_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          tag_id: string
          ticket_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          tag_id?: string
          ticket_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tags_on_tickets_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "ticket_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_tags_on_tickets_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to_user_id: string | null
          closed_at: string | null
          created_at: string
          event_id: string | null
          id: string
          meta: Json | null
          short_id: string
          snoozed_until: string | null
          starred_at: string | null
          subject: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          meta?: Json | null
          short_id: string
          snoozed_until?: string | null
          starred_at?: string | null
          subject: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          meta?: Json | null
          short_id?: string
          snoozed_until?: string | null
          starred_at?: string | null
          subject?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          current_team_id: string
          email: string
          full_name: string
          id: string
          image_url: string | null
          notification_email_new_message: boolean
          notification_email_new_ticket: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_team_id: string
          email: string
          full_name: string
          id?: string
          image_url?: string | null
          notification_email_new_message?: boolean
          notification_email_new_ticket?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_team_id?: string
          email?: string
          full_name?: string
          id?: string
          image_url?: string | null
          notification_email_new_message?: boolean
          notification_email_new_ticket?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      users_on_teams: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["TEAM_ROLE_ENUM"]
          team_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["TEAM_ROLE_ENUM"]
          team_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["TEAM_ROLE_ENUM"]
          team_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_on_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          email_id: string | null
          id: string
          is_invited: boolean
        }
        Insert: {
          created_at?: string
          email: string
          email_id?: string | null
          id?: string
          is_invited?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          email_id?: string | null
          id?: string
          is_invited?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      TEAM_ROLE_ENUM: "OWNER" | "MEMBER"
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
