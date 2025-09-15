import React, { useState } from 'react';
import { AttachmentUpload } from './AttachmentUpload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface TestCase {
  id?: number;
  title: string;
  description: string;
  attachments?: any[];
}

interface TestCaseFormProps {
  testCase?: TestCase;
  onSave: (testCase: TestCase) => void;
}

export const TestCaseForm: React.FC<TestCaseFormProps> = ({
  testCase,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: testCase?.title || '',
    description: testCase?.description || ''
  });
  const [attachments, setAttachments] = useState(testCase?.attachments || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      attachments,
      id: testCase?.id
    });
  };

  const apiEndpoint = testCase?.id 
    ? `/api/v1/test_cases/${testCase.id}/test_case_attachments`
    : '/api/v1/test_cases/temp/test_case_attachments'; // Handle new test cases

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          rows={4}
        />
      </div>

      {testCase?.id && (
        <AttachmentUpload
          testCaseId={testCase.id}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          apiEndpoint={apiEndpoint}
        />
      )}

      <Button type="submit">
        {testCase?.id ? 'Update' : 'Create'} Test Case
      </Button>
    </form>
  );
};