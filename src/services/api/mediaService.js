// Mock media storage for demonstration
let mediaFiles = [];
let nextId = 1;

// Supported file types and size limits
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const validateFile = (file) => {
  const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);
  const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
  
  if (!isImage && !isVideo) {
    throw new Error(`Unsupported file type: ${file.type}. Please upload images (JPEG, PNG, GIF, WebP) or videos (MP4, MOV, AVI, MKV).`);
  }
  
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new Error(`File size too large. Maximum size for ${isImage ? 'images' : 'videos'} is ${maxSizeMB}MB.`);
  }
  
  return { isImage, isVideo };
};

// Simulate file upload by creating a blob URL
const simulateFileUpload = (file) => {
  return new Promise((resolve, reject) => {
    // Simulate upload delay
    setTimeout(() => {
      try {
        const url = URL.createObjectURL(file);
        resolve(url);
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 1000 + 500); // 500-1500ms delay
  });
};

const mediaService = {
  async upload(eventId, files, onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        const uploadedFiles = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Validate file
          const { isImage, isVideo } = validateFile(file);
          
          // Simulate upload progress
          if (onProgress) {
            onProgress(i + 1, files.length);
          }
          
          // Simulate file upload
          const url = await simulateFileUpload(file);
          
          const mediaFile = {
            Id: nextId++,
            eventId: parseInt(eventId),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            url: url,
            mediaType: isImage ? 'image' : 'video',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Guest' // In real app, this would be the authenticated user
          };
          
          mediaFiles.push(mediaFile);
          uploadedFiles.push({ ...mediaFile });
        }
        
        resolve(uploadedFiles);
      } catch (error) {
        reject(error);
      }
    });
  },

  async getByEventId(eventId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventMedia = mediaFiles.filter(media => media.eventId === parseInt(eventId));
        resolve([...eventMedia]);
      }, 200);
    });
  },

  async delete(mediaId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mediaFiles.findIndex(media => media.Id === parseInt(mediaId));
        if (index !== -1) {
          const deletedMedia = mediaFiles.splice(index, 1)[0];
          // Clean up blob URL
          if (deletedMedia.url.startsWith('blob:')) {
            URL.revokeObjectURL(deletedMedia.url);
          }
          resolve({ ...deletedMedia });
        } else {
          reject(new Error('Media file not found'));
        }
      }, 300);
    });
  },

  async getById(mediaId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const media = mediaFiles.find(media => media.Id === parseInt(mediaId));
        if (media) {
          resolve({ ...media });
        } else {
          reject(new Error('Media file not found'));
        }
      }, 200);
    });
  },

  // Utility functions
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getSupportedTypes() {
    return {
      images: SUPPORTED_IMAGE_TYPES,
      videos: SUPPORTED_VIDEO_TYPES,
      all: [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES]
    };
  },

  getMaxSizes() {
    return {
      image: MAX_IMAGE_SIZE,
      video: MAX_VIDEO_SIZE
    };
  }
};

export default mediaService;