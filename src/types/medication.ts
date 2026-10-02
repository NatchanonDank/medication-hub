export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  use: string;
  description: string;
  imageUrl: string;
  dosage?: string;
  sideEffects?: string[];
  warnings?: string[];
  appearance?: string;
  badges?: string[];
}