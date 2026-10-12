export interface Prediction {
  id: number;
  filename?: string;
  image_path: string;
  image_url?: string;
  prediction: string;
  confidence: number;
  created_at: string;
}