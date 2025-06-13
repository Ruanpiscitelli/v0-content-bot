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
      auth_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          status: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          tag_id: string
        }
        Update: {
          content_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          created_at: string | null
          expires_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          prompt: string | null
          tool_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          prompt?: string | null
          tool_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          prompt?: string | null
          tool_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      generated_audios_metadata: {
        Row: {
          audio_url: string
          created_at: string | null
          expires_at: string | null
          id: string
          job_id: string
          metadata: Json | null
          prompt: string
          storage_path: string | null
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          job_id: string
          metadata?: Json | null
          prompt: string
          storage_path?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          job_id?: string
          metadata?: Json | null
          prompt?: string
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_audios_metadata_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "generation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images_metadata: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          image_url: string
          job_id: string
          metadata: Json | null
          prompt: string
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url: string
          job_id: string
          metadata?: Json | null
          prompt: string
          storage_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string
          job_id?: string
          metadata?: Json | null
          prompt?: string
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_metadata_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "generation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_videos_metadata: {
        Row: {
          aspect_ratio: string | null
          created_at: string | null
          duration: number | null
          expires_at: string | null
          id: string
          job_id: string
          metadata: Json | null
          prompt: string
          storage_path: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          job_id: string
          metadata?: Json | null
          prompt: string
          storage_path?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          job_id?: string
          metadata?: Json | null
          prompt?: string
          storage_path?: string | null
          user_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_videos_metadata_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "generation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          input_parameters: Json | null
          job_type: string
          output_metadata: Json | null
          output_url: string | null
          prompt: string
          replicate_prediction_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_parameters?: Json | null
          job_type: string
          output_metadata?: Json | null
          output_url?: string | null
          prompt: string
          replicate_prediction_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_parameters?: Json | null
          job_type?: string
          output_metadata?: Json | null
          output_url?: string | null
          prompt?: string
          replicate_prediction_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          daily_chat_limit: number | null
          features: Json | null
          id: string
          name: string
          price_monthly_usd: number | null
        }
        Insert: {
          daily_chat_limit?: number | null
          features?: Json | null
          id: string
          name: string
          price_monthly_usd?: number | null
        }
        Update: {
          daily_chat_limit?: number | null
          features?: Json | null
          id?: string
          name?: string
          price_monthly_usd?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      temp_uploads: {
        Row: {
          created_at: string | null
          expires_at: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          metadata: Json | null
          upload_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          metadata?: Json | null
          upload_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          metadata?: Json | null
          upload_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_increment_chat_usage: {
        Args:
          | { requesting_user_id: string }
          | { requesting_user_id: string; should_increment?: boolean }
        Returns: Json
      }
      delete_expired_gallery_items: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Types específicos para a aplicação
export type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt?: string;
  created_at: string;
  duration?: number; // para vídeos
  aspect_ratio?: string; // para vídeos
  expires_at?: string;
};

export type GenerationJob = Tables<'generation_jobs'>;
export type Notification = Tables<'notifications'>;
