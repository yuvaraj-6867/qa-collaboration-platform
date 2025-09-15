import React, { useState } from 'react';
import { MediaViewer } from './MediaViewer';
import { FileUpload } from './ui/file-upload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface Document {
  id?: number;
  title: string;
  description: string;
  file_url?: string;
  content_type?: string;
  is_media?: boolean;
}

interface DocumentFormProps {
  document?: Document;
  onSave: (document: Document) => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    description: document?.description || ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    try {
      const file = files[0];
      const formDataObj = new FormData();
      formDataObj.append('document[file]', file);
      formDataObj.append('document[title]', formData.title || file.name);
      formDataObj.append('document[description]', formData.description);
      
      const response = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formDataObj,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      onSave(result.document);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!document?.id) {
      alert('Please upload a file first');
      return;
    }
    onSave({
      ...formData,
      id: document.id
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">Upload Document</h3>
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="*/*"
          multiple={false}
          maxSize={100}
        />
        {uploading && (
          <div className="text-sm text-blue-600 mt-2">
            Uploading document...
          </div>
        )}
      </div>

      {document?.is_media && document.file_url && (
        <MediaViewer
          attachments={[{
            id: document.id!,
            filename: document.title,
            content_type: document.content_type!,
            attachment_type: document.content_type!.startsWith('image/') ? 'image' : 'video',
            file_url: document.file_url
          }]}
          showDelete={false}
        />
      )}

      {document?.id && (
        <Button onClick={handleSubmit}>
          Update Document
        </Button>
      )}
    </div>
  );
};