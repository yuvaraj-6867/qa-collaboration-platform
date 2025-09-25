import React, { useRef, useState } from 'react';
import { Input } from './input';
import { useGlobalSnackbar } from '../SnackbarProvider';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*,video/*,.xlsx,.xls,.csv,.pdf,.doc,.docx",
  multiple = true,
  maxSize = 50,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { showError } = useGlobalSnackbar();

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        showError(`File ${file.name} is too large. Max size is ${maxSize}MB`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      const dt = new DataTransfer();
      validFiles.forEach(file => dt.items.add(file));
      onFileSelect(dt.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          <div className="text-gray-600">
            Drop files here or click to browse
          </div>
          <div className="text-sm text-gray-500">
            Images, videos, and documents (Excel, PDF, Word) up to {maxSize}MB
          </div>
        </div>
      </div>
    </div>
  );
};