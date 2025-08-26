import type { AppState, ClothingType } from '../domain/entities/TryOnRequest';
import { models } from '../data/models';

class AppStateManager {
  private state: AppState = {
    selectedModelId: null,
    selectedModelUrl: null,
    selectedClothingType: null,
    uploadedGarmentUrl: null
  };

  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    if (typeof document === 'undefined') return;

    // Listen for model selection
    document.addEventListener('modelSelected', (e) => {
      const event = e as CustomEvent;
      const { modelId } = event.detail;
      
      const selectedModel = models.find(m => m.id === modelId);
      if (selectedModel) {
        this.updateState({
          selectedModelId: modelId,
          selectedModelUrl: selectedModel.image
        });
      }
    });

    // Listen for clothing category selection
    document.addEventListener('categorySelected', (e) => {
      const event = e as CustomEvent;
      const { category } = event.detail;
      
      this.updateState({
        selectedClothingType: category as ClothingType
      });
    });

    // Also listen for clothes selection events (for compatibility)
    document.addEventListener('clothesSelected', (e) => {
      const event = e as CustomEvent;
      if (event.detail.uploadedUrl) {
        this.updateState({
          uploadedGarmentUrl: event.detail.uploadedUrl
        });
      }
    });

    // Listen for Cloudinary upload
    document.addEventListener('cloudinaryUpload', (e) => {
      const event = e as CustomEvent;
      const { secure_url } = event.detail;
      
      this.updateState({
        uploadedGarmentUrl: secure_url
      });
    });

    // Reset state when model type changes
    document.addEventListener('modelTypeChanged', () => {
      this.resetState();
    });
  }

  private updateState(updates: Partial<AppState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private resetState() {
    this.state = {
      selectedModelId: null,
      selectedModelUrl: null,
      selectedClothingType: null,
      uploadedGarmentUrl: null
    };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState(): AppState {
    return { ...this.state };
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public isReadyForProcessing(): boolean {
    return !!(
      this.state.selectedModelUrl && 
      this.state.uploadedGarmentUrl && 
      this.state.selectedClothingType
    );
  }
}

// Create singleton instance
export const appState = new AppStateManager();