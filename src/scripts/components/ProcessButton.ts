import { appState } from '../init';
import { TryOnService } from '../../data/services/tryOnService';

// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
    if (!processBtn) return;

    // Update button state based on app state
    function updateButtonState() {
      const isReady = appState.isReadyForProcessing();
      processBtn.disabled = !isReady;
      processBtn.classList.toggle('ready', isReady);
    }



    // Subscribe to state changes
    const unsubscribe = appState.subscribe(() => {
      updateButtonState();
    });

    // Handle button click - actual API call with progress tracking
    processBtn.addEventListener('click', async () => {
      if (processBtn.disabled) return;

      const state = appState.getState();
      
      if (!state.selectedModelUrl || !state.uploadedGarmentUrl) {
        console.error('Missing required data for processing');
        return;
      }

      processBtn.classList.add('processing');
      
      // Dispatch process start event for modal
      document.dispatchEvent(new CustomEvent('process-start'));
      
      // Update button text to show progress
      const btnText = processBtn.querySelector('.btn-text') as HTMLElement;
      const loadingText = processBtn.querySelector('.loading-spinner span') as HTMLElement;
      const originalText = btnText?.textContent || 'Process Image';
      
      // Start progress updates
      let progressStep = 0;
      const progressMessages = [
        'Submitting request...',
        'Processing image...',
        'Applying garment...',
        'Finalizing result...'
      ];
      
      const progressInterval = setInterval(() => {
        if (loadingText && progressStep < progressMessages.length) {
          loadingText.textContent = progressMessages[progressStep];
          progressStep++;
        }
      }, 15000); // Update every 15 seconds
      
      try {
        // Create the API request
        const request = TryOnService.createTryOnRequest(
          state.selectedModelUrl,
          state.uploadedGarmentUrl
        );

        // Call the fashn.ai API (this now handles the full async process)
        const result = await TryOnService.processTryOn(request);

        // Clear progress updates
        clearInterval(progressInterval);
        processBtn.classList.remove('processing');

        if (result.success && result.result_url) {
          processBtn.classList.add('completed');
          
          // Dispatch success event with the result
          document.dispatchEvent(new CustomEvent('process-complete', {
            detail: {
              imageUrl: result.result_url,
              success: true,
              processId: result.id
            }
          }));

          // Reset completed state after showing success
          setTimeout(() => {
            processBtn.classList.remove('completed');
            if (btnText) btnText.textContent = originalText;
            if (loadingText) loadingText.textContent = 'Processing...';
          }, 3000);

        } else {
          // Handle API error
          processBtn.classList.add('error');
          
          document.dispatchEvent(new CustomEvent('process-error', {
            detail: {
              error: result.error || 'Processing failed',
              success: false,
              processId: result.id
            }
          }));

          // Reset error state
          setTimeout(() => {
            processBtn.classList.remove('error');
            if (btnText) btnText.textContent = originalText;
            if (loadingText) loadingText.textContent = 'Processing...';
          }, 4000);
        }

      } catch (error) {
        clearInterval(progressInterval);
        processBtn.classList.remove('processing');
        processBtn.classList.add('error');
        
        console.error('Processing error:', error);
        
        document.dispatchEvent(new CustomEvent('process-error', {
          detail: {
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          }
        }));

        // Reset error state
        setTimeout(() => {
          processBtn.classList.remove('error');
          if (btnText) btnText.textContent = originalText;
          if (loadingText) loadingText.textContent = 'Processing...';
        }, 4000);
      }
    });

    // Initial state update
    updateButtonState();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      unsubscribe();
    });
  });
}