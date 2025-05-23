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
      client: {
        Row: {
          clientid: string
          created_at: string
          cl_name: string
          cl_height: number
          cl_weight: number
          cl_dob: string
          cl_phone: string
          cl_p: string
          cl_username: string
          trainer_id: string
          cl_gender_name: string
          cl_pic: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          cl_name: string
          cl_height: number
          cl_weight: number
          cl_dob: string
          cl_phone: string
          cl_p: string
          cl_username: string
          trainer_id: string
          cl_gender_name: string
          cl_pic?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          cl_name?: string
          cl_height?: number
          cl_weight?: number
          cl_dob?: string
          cl_phone?: string
          cl_p?: string
          cl_username?: string
          trainer_id?: string
          cl_gender_name?: string
          cl_pic?: string | null
        }
      }
      meal_plan: {
        Row: {
          id: string
          created_at: string
          calories: number
          protein: number
          fat: number
          fiber: number
          vit2: number
          sodium: number
          client_id: string
          carbs: number
          meal_type: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          calories: number
          protein: number
          fat: number
          fiber: number
          vit2: number
          sodium: number
          client_id: string
          carbs: number
          meal_type: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          calories?: number
          protein?: number
          fat?: number
          fiber?: number
          vit2?: number
          sodium?: number
          client_id?: string
          carbs?: number
          meal_type?: string
          content?: string
        }
      }
      nutrient_target: {
        Row: {
          id: string
          calories: number
          protein: number
          fat: number
          fiber: number
          vit2: number
          sodium: number
          client_id: string
          carbs: number
        }
        Insert: {
          id?: string
          calories: number
          protein: number
          fat: number
          fiber: number
          vit2: number
          sodium: number
          client_id: string
          carbs: number
        }
        Update: {
          id?: string
          calories?: number
          protein?: number
          fat?: number
          fiber?: number
          vit2?: number
          sodium?: number
          client_id?: string
          carbs?: number
        }
      }
      activity: {
        Row: {
          id: string
          unit: string
          qty: number
          client_id: string
        }
        Insert: {
          id?: string
          unit: string
          qty: number
          client_id: string
        }
        Update: {
          id?: string
          unit?: string
          qty?: number
          client_id?: string
        }
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
  }
} 