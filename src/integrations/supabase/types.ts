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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      message_recipients: {
        Row: {
          delivery_token: string | null
          id: string
          message_id: string
          recipient_id: string
          token_expires_at: string | null
          viewed_at: string | null
        }
        Insert: {
          delivery_token?: string | null
          id?: string
          message_id: string
          recipient_id: string
          token_expires_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          delivery_token?: string | null
          id?: string
          message_id?: string
          recipient_id?: string
          token_expires_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          delivery_date: string | null
          delivery_event: string | null
          delivery_trigger:
            | Database["public"]["Enums"]["delivery_trigger"]
            | null
          id: string
          media_urls: string[] | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_event?: string | null
          delivery_trigger?:
            | Database["public"]["Enums"]["delivery_trigger"]
            | null
          id?: string
          media_urls?: string[] | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_event?: string | null
          delivery_trigger?:
            | Database["public"]["Enums"]["delivery_trigger"]
            | null
          id?: string
          media_urls?: string[] | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          relationship: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trusted_contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          invite_sent_at: string | null
          invite_token: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          updated_at: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          invite_sent_at?: string | null
          invite_token?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          invite_sent_at?: string | null
          invite_token?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          enable_encryption: boolean | null
          id: string
          inactivity_check_days: number | null
          last_wishes_content: string | null
          last_wishes_enabled: boolean | null
          min_verifications_required: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enable_encryption?: boolean | null
          id?: string
          inactivity_check_days?: number | null
          last_wishes_content?: string | null
          last_wishes_enabled?: boolean | null
          min_verifications_required?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          enable_encryption?: boolean | null
          id?: string
          inactivity_check_days?: number | null
          last_wishes_content?: string | null
          last_wishes_enabled?: boolean | null
          min_verifications_required?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_contact_by_invite_token: {
        Args: { _token: string }
        Returns: {
          id: string
          name: string
          status: string
          user_id: string
          user_name: string
        }[]
      }
      get_message_by_delivery_token: {
        Args: { _token: string }
        Returns: {
          content: string
          id: string
          media_urls: string[]
          message_recipient_id: string
          sender_name: string
          sent_at: string
          title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_file_in_sent_message: { Args: { file_path: string }; Returns: boolean }
      mark_message_viewed: { Args: { _token: string }; Returns: boolean }
      respond_to_invite: {
        Args: { _accept: boolean; _token: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      contact_status: "pending" | "accepted" | "declined"
      delivery_trigger: "manual" | "scheduled" | "posthumous"
      message_status: "draft" | "scheduled" | "sent"
      message_type: "text" | "audio" | "video" | "photo" | "document"
      verification_status: "unverified" | "verified" | "disputed"
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
      app_role: ["admin", "user"],
      contact_status: ["pending", "accepted", "declined"],
      delivery_trigger: ["manual", "scheduled", "posthumous"],
      message_status: ["draft", "scheduled", "sent"],
      message_type: ["text", "audio", "video", "photo", "document"],
      verification_status: ["unverified", "verified", "disputed"],
    },
  },
} as const
