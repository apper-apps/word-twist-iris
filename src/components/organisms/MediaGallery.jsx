import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MediaUpload from '@/components/molecules/MediaUpload';
import mediaService from '@/services/api/mediaService';

const MediaGallery = ({ eventId, media, onMediaUpdate }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (uploadedFiles) => {
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
    onMediaUpdate();
    setShowUpload(false);
  };

  const handleUploadError = (error) => {
    toast.error(error.message || 'Failed to upload files. Please try again.');
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      setLoading(true);
      await mediaService.delete(mediaId);
      toast.success('File deleted successfully');
      onMediaUpdate();
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Error deleting media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mediaType, fileType) => {
    if (mediaType === 'image') {
      return 'Image';
    } else if (mediaType === 'video') {
      return 'Video';
    }
    return 'File';
  };

  const formatFileSize = (bytes) => {
    return mediaService.formatFileSize(bytes);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Toggle */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setShowUpload(!showUpload)}
          variant="secondary"
          size="sm"
          icon={showUpload ? "X" : "Upload"}
        >
          {showUpload ? "Cancel" : "Upload Files"}
        </Button>
      </div>

      {/* Upload Component */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MediaUpload
              eventId={eventId}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Camera" size={48} className="text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No media files yet</p>
          <p className="text-slate-500 text-sm">Upload photos and videos to share memories!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.map((item) => (
            <motion.div
              key={item.Id}
              className="relative group bg-slate-800/30 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-800/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMedia(item)}
            >
              {/* Media Preview */}
              <div className="aspect-square relative">
                {item.mediaType === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700/50">
                    <ApperIcon name="Video" size={32} className="text-slate-400" />
                  </div>
                )}
                
                {/* File Type Badge */}
                <div className="absolute top-2 left-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-1">
                    <ApperIcon 
                      name={getFileIcon(item.mediaType, item.fileType)} 
                      size={14} 
                      className="text-white" 
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.Id);
                    }}
                    variant="error"
                    size="sm"
                    icon="Trash2"
                    className="!p-1"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* File Info */}
              <div className="p-2">
                <p className="text-white text-xs font-medium truncate">{item.fileName}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-400 text-xs">{formatFileSize(item.fileSize)}</span>
                  <span className="text-slate-500 text-xs">{formatDate(item.uploadedAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Media Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              className="max-w-4xl max-h-full bg-slate-900 rounded-xl overflow-hidden"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h3 className="text-white font-medium">{selectedMedia.fileName}</h3>
                  <p className="text-slate-400 text-sm">
                    {formatFileSize(selectedMedia.fileSize)} • {formatDate(selectedMedia.uploadedAt)}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedMedia(null)}
                  variant="ghost"
                  size="sm"
                  icon="X"
                />
              </div>

              {/* Media Content */}
              <div className="relative">
                {selectedMedia.mediaType === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.fileName}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="max-w-full max-h-[70vh]"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;