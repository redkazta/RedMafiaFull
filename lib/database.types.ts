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
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
          is_active: boolean | null
          password_hash: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_active?: boolean | null
          password_hash: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_active?: boolean | null
          password_hash?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: number
          name: string
          price: number
          price_tokens: number
          image_url: string | null
          description: string | null
          category_id: number | null
          stock_quantity: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          price_tokens: number
          image_url?: string | null
          description?: string | null
          category_id?: number | null
          stock_quantity?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          price_tokens?: number
          image_url?: string | null
          description?: string | null
          category_id?: number | null
          stock_quantity?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shopping_cart: {
        Row: {
          id: number
          user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: number
          cart_id: number | null
          product_id: number | null
          quantity: number
          price_tokens: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          cart_id?: number | null
          product_id?: number | null
          quantity: number
          price_tokens: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          cart_id?: number | null
          product_id?: number | null
          quantity?: number
          price_tokens?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          id: number
          user_id: string | null
          street: string
          city: string
          state: string
          postal_code: string
          country: string | null
          is_default: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          street: string
          city: string
          state: string
          postal_code: string
          country?: string | null
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          street?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string | null
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ecommerce_wishlists: {
        Row: {
          id: number
          user_id: number
          product_id: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id: number
          product_id: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: number
          product_id?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          id: number
          order_number: string
          status: string | null
          total_amount: number
          total_tokens: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_number: string
          status?: string | null
          total_amount: number
          total_tokens: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          order_number?: string
          status?: string | null
          total_amount?: number
          total_tokens?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number | null
          product_id: number | null
          quantity: number
          total_price: number
          total_tokens: number
          unit_price: number
          unit_price_tokens: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity: number
          total_price: number
          total_tokens: number
          unit_price: number
          unit_price_tokens: number
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number
          total_price?: number
          total_tokens?: number
          unit_price?: number
          unit_price_tokens?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          website: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          id: number
          user_id: string | null
          balance: number | null
          current_balance: number | null
          total_earned: number | null
          total_spent: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          balance?: number | null
          current_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          balance?: number | null
          current_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          id: number
          user_id: string | null
          amount: number
          transaction_type: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          amount: number
          transaction_type: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          amount?: number
          transaction_type?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          id: number
          user_id: string | null
          activity_type: string
          description: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          activity_type: string
          description?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          activity_type?: string
          description?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id: number
          user_id: string | null
          setting_key: string
          setting_value: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          setting_key: string
          setting_value: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          setting_key?: string
          setting_value?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      avatars: {
        Row: {
          id: number
          user_id: string | null
          file_path: string
          file_name: string
          file_size: number
          mime_type: string
          is_primary: boolean
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          file_path: string
          file_name: string
          file_size: number
          mime_type: string
          is_primary?: boolean
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          file_path?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          is_primary?: boolean
          created_at?: string | null
        }
        Relationships: []
      }
      user_avatars: {
        Row: {
          id: number
          user_id: string | null
          avatar_id: number | null
          is_primary: boolean
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          avatar_id?: number | null
          is_primary?: boolean
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          avatar_id?: number | null
          is_primary?: boolean
          created_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      artist_profiles: {
        Row: {
          id: number
          user_id: string | null
          artist_name: string
          bio: string | null
          genre: string | null
          social_media: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          artist_name: string
          bio?: string | null
          genre?: string | null
          social_media?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          artist_name?: string
          bio?: string | null
          genre?: string | null
          social_media?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: number
          title: string
          description: string | null
          event_date: string
          location: string | null
          artist_id: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          artist_id?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          artist_id?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      music_tracks: {
        Row: {
          id: number
          title: string
          artist_id: number | null
          album_id: number | null
          duration: number | null
          file_path: string
          genre: string | null
          release_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          artist_id?: number | null
          album_id?: number | null
          duration?: number | null
          file_path: string
          genre?: string | null
          release_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          artist_id?: number | null
          album_id?: number | null
          duration?: number | null
          file_path?: string
          genre?: string | null
          release_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          id: number
          order_id: number | null
          status: string
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          order_id?: number | null
          status: string
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          order_id?: number | null
          status?: string
          notes?: string | null
          created_at?: string | null
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
    ? keyof (Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"] &
        Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"] &
      Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
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
    ? keyof Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"][TableName] extends {
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
    ? keyof Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[Extract<PublicTableNameOrOptions["schema"], keyof Database>]["Tables"][TableName] extends {
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
    ? keyof Database[Extract<PublicEnumNameOrOptions["schema"], keyof Database>]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[Extract<PublicEnumNameOrOptions["schema"], keyof Database>]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
