export const cloudinaryService = {
  async uploadImage(file: File): Promise<string> {
    // Basic file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image file size must be less than 5MB.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Selected file must be a valid image.');
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.secure_url;
        }
      } catch (err) {
        console.warn('Cloudinary upload failed, converting to local preview URL:', err);
      }
    }

    // Fallback: Convert file to Base64 data URL for immediate client preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image file.'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error during image processing.'));
      reader.readAsDataURL(file);
    });
  }
};
