import React from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface Attachment {
  id: number;
  filename: string;
  content_type: string;
  attachment_type: 'image' | 'video' | 'document';
  file_url: string;
}

interface DocumentViewerProps {
  attachments: Attachment[];
  onDelete?: (id: number) => void;
  showDelete?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  attachments,
  onDelete,
  showDelete = false
}) => {
  const documents = attachments.filter(att => att.attachment_type === 'document');

  if (documents.length === 0) return null;

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) {
      return '📊';
    }
    if (contentType.includes('pdf')) {
      return '📄';
    }
    if (contentType.includes('word') || contentType.includes('document')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700">Documents</h4>
      <div className="grid gap-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(doc.content_type)}</span>
              <div>
                <div className="font-medium text-sm">{doc.filename}</div>
                <div className="text-xs text-gray-500">{doc.content_type}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(doc.file_url, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
              {showDelete && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};