export type Phase = 'rough-in' | 'service' | 'trim-out' | 'inspection' | 'complete'
export type MaterialStatus = 'on-site' | 'ordered' | 'needed'
export type InvoiceFollowUpStatus = 'none' | 'sent' | 'responded'

export interface Crew {
  id: string
  name: string
  initials: string
  role: string
  created_at: string
}

export interface Job {
  id: string
  name: string
  gc_name: string
  gc_contact: string | null
  location: string | null
  phase: Phase
  crew: string[]
  margin: number
  contract_value: number
  status: 'active' | 'pipeline' | 'complete'
  progress: number
  deadline: string | null
  created_at: string
}

export interface Material {
  id: string
  job_id: string
  item: string
  quantity: number
  unit: string
  source: string | null
  status: MaterialStatus
  notes: string | null
  created_at: string
}

export interface Invoice {
  id: string
  job_id: string
  invoice_number: string
  client: string
  amount: number
  sent_date: string
  days_outstanding: number
  follow_up_status: InvoiceFollowUpStatus
  follow_up_note: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      crew: {
        Row: Crew
        Insert: Omit<Crew, 'id' | 'created_at'>
        Update: Partial<Omit<Crew, 'id' | 'created_at'>>
        Relationships: []
      }
      jobs: {
        Row: Job
        Insert: Omit<Job, 'id' | 'created_at'>
        Update: Partial<Omit<Job, 'id' | 'created_at'>>
        Relationships: []
      }
      materials: {
        Row: Material
        Insert: Omit<Material, 'id' | 'created_at'>
        Update: Partial<Omit<Material, 'id' | 'created_at'>>
        Relationships: []
      }
      invoices: {
        Row: Invoice
        Insert: Omit<Invoice, 'id' | 'created_at'>
        Update: Partial<Omit<Invoice, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
