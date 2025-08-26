export interface TryOnRequest {
  model_name: string;
  inputs: {
    model_image: string;
    garment_image: string;
  };
}

export interface TryOnInitialResponse {
  id: string;
  error: string | null;
}

export interface TryOnStatusResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string[];
  error: string | null;
}

export interface TryOnResponse {
  success: boolean;
  result_url?: string;
  error?: string;
  message?: string;
  id?: string;
}

export type ClothingType = 'tops' | 'bottoms' | 'one-pieces';

export interface AppState {
  selectedModelId: string | null;
  selectedModelUrl: string | null;
  selectedClothingType: ClothingType | null;
  uploadedGarmentUrl: string | null;
}