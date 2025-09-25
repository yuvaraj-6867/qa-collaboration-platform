import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGlobalSnackbar } from '@/components/SnackbarProvider';

import { Search, Upload, Download, FolderOpen, FileSpreadsheet, FileText, Image, Video, File, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Document {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_size: string;
  content_type: string;
  version: string;
  folder: string;
  tags: string[];
  uploaded_by: string;
  created_at: string;
  file?: File;
  created_by?: string;
}

interface TestCase {
  id: string;
  title: string;
  description: string;
  preconditions: string;
  steps: string;
  expected_results: string;
  priority: number;
  status: string;
  folder: string;
  created_by: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedTestCases, setProcessedTestCases] = useState<TestCase[]>([]);
  const [showTestCasePreview, setShowTestCasePreview] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { showError, showSuccess } = useGlobalSnackbar();


  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const savedDocs = localStorage.getItem('documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument({ ...newDocument, file, title: file.name.split('.')[0] });
      if (file.name.toLowerCase().includes('testcase') || file.name.toLowerCase().includes('test_case')) {
        readExcelFile(file);
      }
    }
  };

  const readExcelFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const testCases = parseTestCasesFromExcel(jsonData as any[][]);
        setProcessedTestCases(testCases);
        setShowTestCasePreview(true);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setIsProcessing(false);
        showError('Error reading Excel file. Please check the format.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const parseTestCasesFromExcel = (data: any[][]): TestCase[] => {
    if (data.length < 2) return [];

    const headers = data[0].map((h: string) => h?.toLowerCase().trim());
    const testCases: TestCase[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const testCase: TestCase = {
        id: `TC-${Date.now()}-${i}`,
        title: getCellValue(row, headers, ['title', 'test case', 'name', 'test_case_name', 'Title']) || `Test Case ${i}`,
        description: getCellValue(row, headers, ['description', 'desc', 'summary', 'Description']) || 'N/A',
        preconditions: getCellValue(row, headers, ['preconditions', 'pre-conditions', 'prerequisites', 'Preconditions']) || '',
        steps: getCellValue(row, headers, ['steps', 'test steps', 'procedure', 'actions', 'Test Steps']) || '',
        expected_results: getCellValue(row, headers, ['expected', 'expected result', 'expected_result', 'expected results', 'result', 'results', 'Expected Results', 'Expected Result', 'Expected_Results', 'Expected_Result', 'EXPECTED RESULTS', 'EXPECTED RESULT']) || '',
        priority: parsePriority(getCellValue(row, headers, ['priority', 'pri', 'Priority'])) || 2,
        status: getCellValue(row, headers, ['status', 'state', 'Status']) || 'Draft',
        folder: 'Test Cases',
        created_by: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Unknown User'
      };

      testCases.push(testCase);
    }

    return testCases;
  };

  const getCellValue = (row: any[], headers: string[], possibleNames: string[]): string => {
    for (const name of possibleNames) {
      const index = headers.indexOf(name);
      if (index !== -1 && row[index]) {
        return String(row[index]).trim();
      }
    }
    return '';
  };

  const parsePriority = (value: string): number => {
    if (!value) return 2;
    const val = value.toLowerCase();
    if (val.includes('high') || val.includes('1')) return 1;
    if (val.includes('low') || val.includes('3')) return 3;
    return 2;
  };

  const importTestCases = () => {
    const existingTestCases = JSON.parse(localStorage.getItem('testCases') || '[]');
    const updatedTestCases = [...existingTestCases, ...processedTestCases];
    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
    handleUploadDocument();
    setShowTestCasePreview(false);
        if ((window as any).addNotification) {
      (window as any).addNotification(
        'Test Cases Imported', 
        `Successfully imported ${processedTestCases.length} test cases to the "Test Cases" folder. You can view them in the Test Cases page.`, 
        'success'
      );
    } else {
      showSuccess(`Successfully imported ${processedTestCases.length} test cases! Check the Test Cases page under "Test Cases" folder.`);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(document.id);
      
      request.onsuccess = () => {
        const fileData = request.result;
        if (fileData && fileData.blob) {
          const url = URL.createObjectURL(fileData.blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = fileData.name || document.title;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          showError('File not found');
        }
      };
      
      request.onerror = () => {
        showError('Download failed');
      };
    } catch (error) {
      showError('Download failed');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DocumentsDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
    });
  };

  const storeFile = async (id: number, file: File) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      await store.put({ id, blob: file, name: file.name });
    } catch (error) {
      console.error('Failed to store file:', error);
    }
  };

  const handleUploadDocument = async () => {
    if (!newDocument.file || !newDocument.title.trim()) {
      showError('Please select a file and enter a title');
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(async () => {
      const docId = Date.now();
      const document: Document = {
        id: docId,
        title: newDocument.title,
        description: newDocument.description,
        file_path: `documents/${newDocument.file!.name}`,
        file_size: formatFileSize(newDocument.file!.size),
        content_type: newDocument.file!.type,
        version: '1.0',
        folder: 'General',
        tags: [],
        uploaded_by: currentUser.email || 'Unknown',
        created_at: new Date().toISOString()
      };

      await storeFile(docId, newDocument.file!);
      const updatedDocuments = [...documents, document];
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      if ((window as any).addNotification) {
        (window as any).addNotification(
          'Document Uploaded', 
          `Document "${document.title}" has been uploaded successfully`, 
          'success'
        );
      }

      setIsUploadDialogOpen(false);
      setUploadProgress(0);
      setNewDocument({
        title: '',
        description: '',
        file: null
      });
    }, 1200);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string, fileName?: string) => {
    if (fileName?.toLowerCase().includes('.xlsx') || fileName?.toLowerCase().includes('.xls')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
    }
    if (contentType.includes('pdf')) return <FileText className="h-6 w-6 text-red-600" />;
    if (contentType.includes('image')) return <Image className="h-6 w-6 text-blue-600" />;
    if (contentType.includes('video')) return <Video className="h-6 w-6 text-purple-600" />;
    if (contentType.includes('text')) return <FileText className="h-6 w-6 text-gray-600" />;
    return <File className="h-6 w-6 text-gray-600" />;
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> Document Repository</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>File *</Label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".xlsx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: Excel files
                </p>
              </div>

              <div>
                <Label>Title *</Label>
                <Input
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Document title"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>



              {isProcessing && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">Processing Excel file...</span>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadDocument} disabled={!newDocument.file || isProcessing}>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <FolderOpen className="h-4 w-4 mr-2" />
          Browse Folders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length === 0 ? (
          <div className="h-[calc(100vh-300px)] flex items-center justify-center col-span-full">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">No documents found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Upload your first document to get started
              </p>
            </div>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.content_type, document.title)}
                    <div>
                      <CardTitle className="text-lg">{document.title}</CardTitle>
                      <CardDescription>
                        v{document.version} • {document.file_size}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{document.folder}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {document.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
                  )}

                  <div className="text-xs text-gray-500">
                    <div>Uploaded by: {document.uploaded_by}</div>
                    <div>Created: {new Date(document.created_at).toLocaleDateString()}</div>
                  </div>

                  {document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(document)}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showTestCasePreview} onOpenChange={setShowTestCasePreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Test Cases Found in Excel
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Found {processedTestCases.length} test cases in the Excel file
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTestCases.slice(0, 10).map((tc, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{tc.title}</td>
                      <td className="p-2 text-gray-600 truncate max-w-xs">{tc.description}</td>
                      <td className="p-2">
                        <Badge variant={tc.priority === 1 ? 'destructive' : tc.priority === 3 ? 'secondary' : 'default'}>
                          {tc.priority === 1 ? 'High' : tc.priority === 3 ? 'Low' : 'Medium'}
                        </Badge>
                      </td>
                      <td className="p-2">{tc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {processedTestCases.length > 10 && (
                <p className="text-sm text-gray-500 p-2">
                  ... and {processedTestCases.length - 10} more test cases
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTestCasePreview(false)}>
                Skip Import
              </Button>
              <Button onClick={importTestCases} className="bg-green-600 hover:bg-green-700">
                Import Test Cases
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
