import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import mediaService from '@/services/api/mediaService';

const MediaUpload = ({ eventId, onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rejection => 
        `${rejection.file.name}: ${rejection.errors[0].message}`
      );
      onUploadError(new Error(errors.join(', ')));
      return;
    }

    if (acceptedFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress({ current: 0, total: acceptedFiles.length });

      const uploadedFiles = await mediaService.upload(
        eventId, 
        acceptedFiles,
        (current, total) => setUploadProgress({ current, total })
      );

      onUploadSuccess(uploadedFiles);
    } catch (error) {
      onUploadError(error);
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  }, [eventId, onUploadSuccess, onUploadError]);

  const supportedTypes = mediaService.getSupportedTypes();
  const maxSizes = mediaService.getMaxSizes();

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxSize: Math.max(maxSizes.image, maxSizes.video),
    multiple: true
  });

  const getDropzoneStyle = () => {
    if (isDragReject) {
      return 'border-error-500 bg-error-500/10';
    } else if (isDragActive) {
      return 'border-primary-500 bg-primary-500/10';
    } else {
      return 'border-slate-600/50 hover:border-slate-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${getDropzoneStyle()}`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon 
              name={isDragActive ? "Upload" : "Camera"} 
              size={48} 
              className={`mx-auto mb-4 ${
                isDragReject ? 'text-error-400' : 
                isDragActive ? 'text-primary-400' : 'text-slate-400'
              }`} 
            />
          </motion.div>
          
          <div className="space-y-2">
            {isDragReject ? (
              <p className="text-error-400 font-medium">
                Some files are not supported
              </p>
            ) : isDragActive ? (
              <p className="text-primary-400 font-medium">
                Drop files here to upload
              </p>
            ) : (
              <>
                <p className="text-white font-medium">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-slate-400 text-sm">
                  Upload photos and videos to share with guests
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Progress Overlay */}
        {uploading && (
          <motion.div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Loader2" size={32} className="text-primary-400 mx-auto mb-2" />
              </motion.div>
              <p className="text-white font-medium">
                Uploading... {uploadProgress.current} of {uploadProgress.total}
              </p>
              <div className="w-48 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* File Requirements */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" size={16} className="text-slate-400 mt-0.5" />
          <div className="text-sm text-slate-400 space-y-1">
            <p><strong className="text-slate-300">Supported formats:</strong></p>
            <p>• Images: JPEG, PNG, GIF, WebP (max 10MB)</p>
            <p>• Videos: MP4, MOV, AVI, MKV (max 100MB)</p>
            <p>• Multiple files can be uploaded at once</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;