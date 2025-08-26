import type {
  TryOnRequest,
  TryOnResponse,
  TryOnInitialResponse,
  TryOnStatusResponse,
  QualityMode
} from '../../domain/entities/TryOnRequest';

const FASHN_API_URL = 'https://api.fashn.ai/v1/run';
const FASHN_STATUS_URL = 'https://api.fashn.ai/v1/status';

// Get API key from DOM element (passed from server-side)
function getFashnApiKey(): string | null {
  if (typeof document === 'undefined') return null;

  const configElement = document.getElementById('fashn-config');
  return configElement?.getAttribute('data-api-key') || null;
}

export class TryOnService {
  static async processTryOn(request: TryOnRequest): Promise<TryOnResponse> {
    try {
      const apiKey = getFashnApiKey();

      if (!apiKey) {
        throw new Error('FASHN_API_KEY is not configured. Please check your .env file and restart the dev server.');
      }

      // Step 1: Submit the try-on request
      const initialResponse = await this.submitTryOnRequest(request, apiKey);

      if (initialResponse.error) {
        return {
          success: false,
          error: initialResponse.error
        };
      }

      // Step 2: Poll for completion
      const finalResult = await this.pollForCompletion(initialResponse.id, apiKey);

      return finalResult;

    } catch (error) {
      console.error('TryOn API Error:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static async submitTryOnRequest(request: TryOnRequest, apiKey: string): Promise<TryOnInitialResponse> {
    const response = await fetch(FASHN_API_URL, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private static async checkStatus(id: string, apiKey: string): Promise<TryOnStatusResponse> {
    const response = await fetch(`${FASHN_STATUS_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status check failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private static async pollForCompletion(id: string, apiKey: string): Promise<TryOnResponse> {
    const maxAttempts = 30; // 30 attempts over ~1 minute
    const pollInterval = 2000; // 2 seconds between polls

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const statusResponse = await this.checkStatus(id, apiKey);

        if (statusResponse.error) {
          return {
            success: false,
            error: statusResponse.error,
            id: id
          };
        }

        switch (statusResponse.status) {
          case 'completed':
            if (statusResponse.output && statusResponse.output.length > 0) {
              return {
                success: true,
                result_url: statusResponse.output[0],
                id: id
              };
            } else {
              return {
                success: false,
                error: 'No output image received',
                id: id
              };
            }

          case 'failed':
            return {
              success: false,
              error: 'Processing failed',
              id: id
            };

          case 'pending':
          case 'processing':
            // Continue polling
            await this.delay(pollInterval);
            break;

          default:
            return {
              success: false,
              error: `Unknown status: ${statusResponse.status}`,
              id: id
            };
        }
      } catch (error) {
        console.error(`Status check attempt ${attempt + 1} failed:`, error);

        // If it's the last attempt, return the error
        if (attempt === maxAttempts - 1) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Status check failed',
            id: id
          };
        }

        // Otherwise, wait and try again
        await this.delay(pollInterval);
      }
    }

    return {
      success: false,
      error: 'Processing timeout - please try again',
      id: id
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static createTryOnRequest(
    modelImageUrl: string,
    garmentImageUrl: string,
    mode: 'performance' | 'balanced' | 'quality' = 'quality'
  ): TryOnRequest {
    return {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImageUrl,
        garment_image: garmentImageUrl
      },
      mode: mode
    };
  }
}