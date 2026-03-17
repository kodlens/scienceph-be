export interface ValidationError {
  errors: Record<string, string[]>
}


export interface MaterialAssignment {
  id: number;
  encoder_user_id: number;
  publisher_user_id: number;
  created_at: string | Date;
  updated_at: string | Date;
}
