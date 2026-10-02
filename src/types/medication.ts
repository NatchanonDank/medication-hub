export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  strength: string;
  dosageForm: string;
  category: string;
  prescriptionType?: string;
  specialTag?: string;
  dosageInstruction?: string;
  appearance?: string;  
  indications: string[];
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
  pregnancyCategory: string;
  imageUrl: string;
}