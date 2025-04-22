export function b64toBlob(
    b64Data: string,
    contentType?: any,
    sliceSize?: number
  ) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
  
    // Handle data URIs by removing the prefix if present
    if (b64Data.startsWith('data:')) {
      const parts = b64Data.split(',');
      if (parts.length === 2) {
        // If contentType wasn't explicitly provided, extract it from the data URI
        if (!contentType || contentType === "") {
          const matches = parts[0].match(/:(.*?);/);
          if (matches && matches.length > 1) {
            contentType = matches[1];
          }
        }
        b64Data = parts[1];
      }
    }
  
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
  
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

/**
 * Converts base64 to a Blob and compresses it to a target size
 * @param base64Data Base64 string (can be a data URI)
 * @param maxSizeMB Maximum size in MB
 * @param contentType Optional content type
 * @returns Promise with compressed image as Blob
 */
export function compressBase64Image(
  base64Data: string, 
  maxSizeMB: number = 3,
  contentType?: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // First convert base64 to Blob using your existing function
    const initialBlob = b64toBlob(base64Data, contentType);
    
    // Create an image element to load the blob
    const img = new Image();
    img.src = URL.createObjectURL(initialBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      
      // If the image is already smaller than maxSize, return it as is
      if (initialBlob.size <= maxSizeMB * 1024 * 1024) {
        resolve(initialBlob);
        return;
      }
      
      // Otherwise compress it
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      
      // Start with original dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Try compression with decreasing quality
      let quality = 0.9;
      
      const compressStep = (currentQuality: number) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
          
          if (blob.size <= maxSizeMB * 1024 * 1024 || currentQuality <= 0.1) {
            // Target size achieved or reached minimum quality
            resolve(blob);
          } else {
            // Try again with lower quality
            compressStep(Math.max(currentQuality - 0.1, 0.1));
          }
        }, contentType || 'image/jpeg', currentQuality);
      };
      
      // Start compression process
      compressStep(quality);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image from base64 data'));
    };
  });
}