# Fashn.ai API Integration

This document describes the integration with the Fashn.ai virtual try-on API.

## Setup

1. **Get your API key** from Fashn.ai
2. **Add it to your .env file**:
   ```
   VITE_FASHN_API_KEY=your_actual_api_key_here
   ```
3. **Restart the development server** (required for environment variables)

## Architecture Note

The API key is handled using Astro's server-side environment access pattern:
- Environment variable is read server-side in `ProcessButton.astro`
- Passed to client-side via a hidden data attribute
- Retrieved by the service using DOM access

This ensures the API key is available in the browser while maintaining security.

## Architecture

The integration follows a clean architecture pattern:

### Domain Layer (`src/domain/`)
- **entities/**: Contains business entities and interfaces
  - `TryOnRequest.ts` - API request/response interfaces and app state
  - `Model.ts` - Model entity interface

### Data Layer (`src/data/`)
- **services/**: Contains external API communication
  - `tryOnService.ts` - Fashn.ai API service
- **models.ts**: Model data (moved interface to domain layer)

### Scripts Layer (`src/scripts/`)
- **appState.ts**: Centralized state management
- **components/**: Component-specific logic

## How it works

### User Flow
1. User selects a model from the gallery
2. User selects a clothing category (tops, bottoms, one-pieces)
3. User uploads a garment image via Cloudinary
4. User clicks "Process Image" button
5. App sends request to Fashn.ai API and receives a job ID
6. App polls the status endpoint every 2 seconds for up to 1 minute
7. Progress messages are shown to the user during processing
8. Final result image is displayed when processing completes

### API Request Format
```javascript
{
  model_name: "tryon-v1.6",
  inputs: {
    model_image: "https://example.com/model.jpg",
    garment_image: "https://example.com/garment.jpg"
  }
}
```

### API Response Flow

#### Step 1: Initial Request Response
```javascript
{
  "id": "123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1",
  "error": null
}
```

#### Step 2: Status Polling (every 2 seconds for up to 1 minute)
```javascript
{
  "id": "123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1",
  "status": "completed",
  "output": [
    "https://cdn.fashn.ai/123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1/output_0.png"
  ],
  "error": null
}
```

Status values: `pending`, `processing`, `completed`, `failed`

### Files Created/Modified

#### New Files:
- `src/domain/entities/TryOnRequest.ts` - Domain entities for API requests and app state
- `src/domain/entities/Model.ts` - Model entity interface
- `src/data/services/tryOnService.ts` - Service class for API communication
- `src/scripts/appState.ts` - State management for selected model, category, and uploaded image
- `src/scripts/init.ts` - App initialization

#### Modified Files:
- `src/scripts/components/ProcessButton.ts` - Updated to use real API instead of simulation
- `src/scripts/components/ClothesSelector.ts` - Added Cloudinary upload handling
- `src/styles/components/process-button.css` - Added error state styles
- `.env` - Added FASHN_API_KEY configuration

## State Management

The app uses a centralized state manager (`appState`) that tracks:
- Selected model ID and image URL
- Selected clothing category
- Uploaded garment image URL

The process button is enabled only when all three pieces of data are available.

## Error Handling

The integration includes comprehensive error handling:
- Missing API key
- Network errors during initial request
- Network errors during status polling
- API response errors
- Processing timeouts (after 1 minute)
- Failed processing status
- Invalid responses

Errors are displayed to the user via button state changes and console logging.

## Processing Flow

1. **Submit Request**: POST to `/v1/run` → receives job ID
2. **Poll Status**: GET `/v1/status/{id}` every 2 seconds
3. **Progress Updates**: User sees different messages every 15 seconds
4. **Completion**: Extract output URL from completed status response
5. **Timeout**: After 30 attempts (1 minute), show timeout error

## Events

The system uses custom DOM events for communication:
- `modelSelected` - When user selects a model
- `categorySelected` - When user selects clothing category  
- `cloudinaryUpload` - When user uploads an image
- `process-complete` - When API call succeeds
- `process-error` - When API call fails

## Testing

To test the integration:
1. Ensure you have a valid Fashn.ai API key
2. Select a model, category, and upload an image
3. Click the process button
4. Check browser console for API request/response details