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
      user_accounts: {
        Row: {
          id: string
          username: string | null
          plan: 'free' | 'plus' | 'pro'
          onboarding_status: 'not_started' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          plan?: 'free' | 'plus' | 'pro'
          onboarding_status?: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          plan?: 'free' | 'plus' | 'pro'
          onboarding_status?: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      profiles: {
        Row: {
          id: string
          public_name: string
          headline: string
          bio: string
          location: string
          public_email: string
          linkedin: string
          github: string
          website: string
          whatsapp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          public_name?: string
          headline?: string
          bio?: string
          location?: string
          public_email?: string
          linkedin?: string
          github?: string
          website?: string
          whatsapp?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          public_name?: string
          headline?: string
          bio?: string
          location?: string
          public_email?: string
          linkedin?: string
          github?: string
          website?: string
          whatsapp?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      professional_data: {
        Row: {
          id: string
          role_title: string
          professional_summary: string
          work_area: string
          experience_level: string
          main_skills: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role_title?: string
          professional_summary?: string
          work_area?: string
          experience_level?: string
          main_skills?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role_title?: string
          professional_summary?: string
          work_area?: string
          experience_level?: string
          main_skills?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      portfolio_settings: {
        Row: {
          id: string
          template_id: string | null
          public_slug: string
          publication_status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          template_id?: string | null
          public_slug: string
          publication_status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string | null
          public_slug?: string
          publication_status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      portfolio_editor: {
        Row: {
          id: string
          template_id: string | null
          device: 'desktop' | 'mobile'
          active_section: 'hero' | 'about' | 'projects' | 'contact'
          active_project_id: string | null
          visibility: Json
          hero: Json
          about: Json
          contact: Json
          projects: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          template_id?: string | null
          device?: 'desktop' | 'mobile'
          active_section?: 'hero' | 'about' | 'projects' | 'contact'
          active_project_id?: string | null
          visibility?: Json
          hero?: Json
          about?: Json
          contact?: Json
          projects?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string | null
          device?: 'desktop' | 'mobile'
          active_section?: 'hero' | 'about' | 'projects' | 'contact'
          active_project_id?: string | null
          visibility?: Json
          hero?: Json
          about?: Json
          contact?: Json
          projects?: Json
          created_at?: string
          updated_at?: string
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