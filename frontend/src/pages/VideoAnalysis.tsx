import { useState, useRef } from 'react';
import { Upload, FileVideo, Loader2 } from 'lucide-react';
import { videoAnalysisApi, VideoAnalysisResult } from '../lib/videoAnalysisApi';

const VideoAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VideoAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      const uploadData = await videoAnalysisApi.uploadVideo(selectedFile);
      const analysisData = await videoAnalysisApi.analyzeVideo(uploadData.id);
      console.log('Analysis data received:', analysisData);
      console.log('Results:', analysisData.results);
      setResults(analysisData.results);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Video Analysis</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Click to upload video</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="font-medium">{selectedFile.name}</p>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
              </button>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <h3 className="font-medium mb-3">Video Preview:</h3>
              <video 
                src={URL.createObjectURL(selectedFile)} 
                controls 
                className="w-full max-h-96 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🧪 Test Case Generated</h2>
            <p className="text-gray-600">Test case created from video: {results.video_source || selectedFile?.name}</p>
          </div>
          

          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">{results.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">{results.description || 'Description not available'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preconditions:</h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">{results.preconditions || 'Preconditions not available'}</p>
                </div>
                
                <div className="flex space-x-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Priority:</h4>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      results.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      results.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {results.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Status:</h4>
                    <span className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
                      {results.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Test Steps:</h4>
                  <div className="text-sm text-gray-600 bg-white p-3 rounded border whitespace-pre-wrap">
                    {results.test_steps || 'Test steps not available'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Expected Results:</h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">{results.expected_results || 'Expected results not available'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">🎬 Video-to-Test Case Conversion:</h4>
            <p className="text-sm text-gray-600">
              Automatically generated test case from video analysis. Ready to import into your test management system.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;