export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          display_name: string
          permissions: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          permissions?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          permissions?: Json
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          first_name: string
          last_name: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          first_name: string
          last_name: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          first_name?: string
          last_name?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          assigned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          assigned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_tokens: {
        Row: {
          id: string
          user_id: string
          current_balance: number
          total_earned: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_balance?: number
          total_earned?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_balance?: number
          total_earned?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      product_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          artist_id: string | null
          price_tokens: number
          original_price_mxn: number | null
          stock_quantity: number
          main_image_url: string
          image_urls: string[] | null
          status: string
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          artist_id?: string | null
          price_tokens: number
          original_price_mxn?: number | null
          stock_quantity?: number
          main_image_url: string
          image_urls?: string[] | null
          status?: string
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          artist_id?: string | null
          price_tokens?: number
          original_price_mxn?: number | null
          stock_quantity?: number
          main_image_url?: string
          image_urls?: string[] | null
          status?: string
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shopping_cart: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string | null
          quantity: number
          price_tokens: number
          added_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id?: string | null
          quantity?: number
          price_tokens: number
          added_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string | null
          quantity?: number
          price_tokens?: number
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "shopping_cart"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      purchase_orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          total_tokens: number
          total_items: number
          status: string
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          total_tokens: number
          total_items: number
          status?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          total_tokens?: number
          total_items?: number
          status?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      purchase_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          unit_price_tokens: number
          quantity: number
          total_price_tokens: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          unit_price_tokens: number
          quantity: number
          total_price_tokens: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          unit_price_tokens?: number
          quantity?: number
          total_price_tokens?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          from_status: string | null
          to_status: string
          changed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          from_status?: string | null
          to_status: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          from_status?: string | null
          to_status?: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          address_type: string
          is_default: boolean
          recipient_name: string
          phone: string | null
          street_address: string
          city: string
          state: string
          postal_code: string
          country: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address_type: string
          is_default?: boolean
          recipient_name: string
          phone?: string | null
          street_address: string
          city: string
          state: string
          postal_code: string
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address_type?: string
          is_default?: boolean
          recipient_name?: string
          phone?: string | null
          street_address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      artist_profiles: {
        Row: {
          id: string
          user_id: string
          stage_name: string
          bio: string | null
          genre: string[] | null
          hometown: string | null
          followers_count: number
          monthly_listeners: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stage_name: string
          bio?: string | null
          genre?: string[] | null
          hometown?: string | null
          followers_count?: number
          monthly_listeners?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stage_name?: string
          bio?: string | null
          genre?: string[] | null
          hometown?: string | null
          followers_count?: number
          monthly_listeners?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          artist_id: string | null
          event_type: string
          is_virtual: boolean
          start_date: string
          end_date: string
          venue_name: string | null
          city: string | null
          state: string | null
          country: string
          ticket_price_tokens: number | null
          max_capacity: number | null
          available_tickets: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          artist_id?: string | null
          event_type: string
          is_virtual?: boolean
          start_date: string
          end_date: string
          venue_name?: string | null
          city?: string | null
          state?: string | null
          country?: string
          ticket_price_tokens?: number | null
          max_capacity?: number | null
          available_tickets?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          artist_id?: string | null
          event_type?: string
          is_virtual?: boolean
          start_date?: string
          end_date?: string
          venue_name?: string | null
          city?: string | null
          state?: string | null
          country?: string
          ticket_price_tokens?: number | null
          max_capacity?: number | null
          available_tickets?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_token_balance: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      user_has_role: {
        Args: {
          user_uuid: string
          role_name: string
        }
        Returns: boolean
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
