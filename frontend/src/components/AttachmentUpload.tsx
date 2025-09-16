import React, { useState } from 'react';
import { FileUpload } from './ui/file-upload';
import { MediaViewer } from './MediaViewer';

interface Attachment {
  id: number;
  filename: string;
  content_type: string;
  attachment_type: 'image' | 'video';
  file_url: string;
}

interface AttachmentUploadProps {
  testCaseId?: number;
  documentId?: number;
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  apiEndpoint: string;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  testCaseId: _testCaseId,
  documentId: _documentId,
  attachments,
  onAttachmentsChange,
  apiEndpoint
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const result = await response.json();
        return result.attachment;
      });
      
      const newAttachments = await Promise.all(uploadPromises);
      onAttachmentsChange([...attachments, ...newAttachments]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    try {
      const response = await fetch(`${apiEndpoint}/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Attachments</h3>
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="image/*,video/*"
          multiple={true}
          maxSize={50}
        />
        {uploading && (
          <div className="text-sm text-blue-600 mt-2">
            Uploading files...
          </div>
        )}
      </div>
      
      <MediaViewer
        attachments={attachments}
        onDelete={handleDelete}
        showDelete={true}
      />
    </div>
  );
};