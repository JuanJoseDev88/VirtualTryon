// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const placeholderState = document.getElementById('placeholderState') as HTMLElement;
    const resultPreview = document.getElementById('resultPreview') as HTMLElement;
    const resultImage = document.getElementById('resultImage') as HTMLImageElement;
    const processingModal = document.getElementById('processingModal') as HTMLElement;
    const processingStatus = document.getElementById('processingStatus') as HTMLElement;
    const progressFill = document.getElementById('progressFill') as HTMLElement;
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    
    let progressInterval: NodeJS.Timeout | null = null;
    let currentImageUrl: string | null = null;

    function showPlaceholder() {
      if (placeholderState) placeholderState.style.display = 'flex';
      if (resultPreview) resultPreview.style.display = 'none';
    }

    function showResult(imageUrl: string) {
      currentImageUrl = imageUrl;
      if (resultImage) resultImage.src = imageUrl;
      if (placeholderState) placeholderState.style.display = 'none';
      if (resultPreview) resultPreview.style.display = 'block';
    }

    async function downloadImage() {
      if (!currentImageUrl) return;

      try {
        // Fetch the image
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `tryon-result-${timestamp}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Download failed:', error);
        
        // Fallback: open in new tab
        window.open(currentImageUrl, '_blank');
      }
    }

    function showProcessingModal() {
      if (processingModal) processingModal.style.display = 'flex';
      
      // Start progress animation
      let progress = 0;
      const progressMessages = [
        'Submitting request...',
        'Processing image...',
        'Applying garment...',
        'Finalizing result...'
      ];
      let messageIndex = 0;

      if (progressFill) progressFill.style.width = '0%';
      
      progressInterval = setInterval(() => {
        progress += 2; // Increase by 2% every interval
        
        if (progressFill) {
          progressFill.style.width = `${Math.min(progress, 95)}%`; // Cap at 95% until completion
        }
        
        // Update message every 25% progress
        if (progress % 25 === 0 && messageIndex < progressMessages.length - 1) {
          messageIndex++;
          if (processingStatus) {
            processingStatus.textContent = progressMessages[messageIndex];
          }
        }
      }, 1000); // Update every second
    }

    function hideProcessingModal() {
      if (processingModal) processingModal.style.display = 'none';
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      // Complete the progress bar
      if (progressFill) progressFill.style.width = '100%';
      
      // Reset for next time
      setTimeout(() => {
        if (progressFill) progressFill.style.width = '0%';
        if (processingStatus) processingStatus.textContent = 'Submitting request...';
      }, 500);
    }

    // Event listeners
    document.addEventListener('process-start', () => {
      showProcessingModal();
    });

    document.addEventListener('process-complete', (e) => {
      const customEvent = e as CustomEvent;
      const { imageUrl, success } = customEvent.detail;

      hideProcessingModal();
      
      if (success && imageUrl) {
        showResult(imageUrl);
      }
    });

    document.addEventListener('process-error', () => {
      hideProcessingModal();
    });

    // Close modal when clicking backdrop
    if (processingModal) {
      processingModal.addEventListener('click', (e) => {
        if (e.target === processingModal) {
          // Don't allow closing during processing
          // hideProcessingModal();
        }
      });
    }

    // Download button event listener
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadImage);
    }

    // Initialize with placeholder
    showPlaceholder();
  });
}