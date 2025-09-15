import React from 'react';
import { Button } from './ui/button';

interface Attachment {
  id: number;
  filename: string;
  content_type: string;
  attachment_type: 'image' | 'video';
  file_url: string;
}

interface MediaViewerProps {
  attachments: Attachment[];
  onDelete?: (id: number) => void;
  showDelete?: boolean;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  attachments,
  onDelete,
  showDelete = false
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const images = attachments.filter(att => att.attachment_type === 'image');
  const videos = attachments.filter(att => att.attachment_type === 'video');

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.file_url}
                  alt={image.filename}
                  className="w-full h-32 object-cover rounded border"
                />
                {showDelete && onDelete && (
                  <Button
                    size="sm"
                    variant="default"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(image.id)}
                  >
                    ×
                  </Button>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                  {image.filename}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Videos</h4>
          <div className="space-y-2">
            {videos.map((video) => (
              <div key={video.id} className="relative group">
                <video
                  controls
                  className="w-full max-h-64 rounded border"
                  preload="metadata"
                >
                  <source src={video.file_url} type={video.content_type} />
                  Your browser does not support the video tag.
                </video>
                {showDelete && onDelete && (
                  <Button
                    size="sm"
                    variant="default"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(video.id)}
                  >
                    ×
                  </Button>
                )}
                <div className="text-sm text-gray-600 mt-1">
                  {video.filename}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};