// Cloudinary upload widget functionality
declare global {
    interface Window {
        cloudinary: any;
    }
}

interface CloudinaryUploadResult {
    event: string;
    info: {
        secure_url: string;
        public_id: string;
        width: number;
        height: number;
        format: string;
        resource_type: string;
        [key: string]: any;
    };
}

// Load Cloudinary widget dynamically to avoid ad blocker issues
function loadCloudinaryWidget(): Promise<any> {
    return new Promise((resolve, reject) => {
        if (window.cloudinary) {
            resolve(window.cloudinary);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
        script.onload = () => resolve(window.cloudinary);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function initializeCloudinaryUpload() {
    try {
        // Load Cloudinary widget
        await loadCloudinaryWidget();

        // Get the config values from data attributes
        const configElement = document.getElementById('cloudinary-config');

        if (!configElement) {
            console.error('Cloudinary config element not found');
            return;
        }

        const cloudName = configElement.getAttribute('data-cloud-name');
        const uploadPreset = configElement.getAttribute('data-upload-preset');

        // Check if values are properly loaded
        if (!cloudName || !uploadPreset) {
            console.error('Cloudinary configuration is missing. Please check your environment variables.');
            return;
        }

        // Create the upload widget
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ['local', 'url', 'camera'],
                multiple: true,
                folder: 'user_uploads',
                clientAllowedFormats: ['image'],
                maxFileSize: 5000000, // 5MB in bytes
                maxImageWidth: 2000,
                maxImageHeight: 2000,
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#90A0B3',
                        tabIcon: '#0078FF',
                        menuIcons: '#5A616A',
                        textDark: '#000000',
                        textLight: '#FFFFFF',
                        link: '#0078FF',
                        action: '#339933',
                        inactiveTabIcon: '#0E2F5A',
                        error: '#F44235',
                        inProgress: '#0078FF',
                        complete: '#339933',
                        sourceBg: '#E4EBF1',
                    },
                    fonts: {
                        default: {
                            active: true,
                        },
                    },
                },
            },
            (error: any, result: CloudinaryUploadResult) => {
                if (!error && result && result.event === 'success') {
                    console.log('Upload successful! Image info: ', result.info);

                    // Dispatch a custom event to handle the uploaded image
                    const uploadEvent = new CustomEvent('cloudinaryUpload', {
                        detail: result.info,
                    });
                    document.dispatchEvent(uploadEvent);

                    // You can add additional logic here for handling successful uploads
                } else if (error) {
                    console.error('Upload error:', error);
                }
            }
        );

        // Attach click event to the upload button
        const uploadButton = document.getElementById('upload_widget') as HTMLButtonElement;
        if (uploadButton) {
            uploadButton.addEventListener(
                'click',
                function () {
                    myWidget.open();
                },
                false
            );
        }

        return myWidget;
    } catch (error) {
        console.error('Failed to load Cloudinary widget:', error);

        // Fallback: show a simple file input or disable button
        const uploadButton = document.getElementById('upload_widget') as HTMLButtonElement;
        if (uploadButton) {
            uploadButton.textContent = 'Upload unavailable (ad blocker?)';
            uploadButton.disabled = true;
        }

        throw error;
    }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeCloudinaryUpload);
}