const API_BASE_URL = '/api/v1';

export interface VideoAnalysisResult {
  title: string;
  description: string;
  preconditions: string;
  test_steps: string;
  expected_results: string;
  priority: string;
  status: string;
  video_source: string;
  test_case_table: Record<string, string>;
}

class VideoAnalysisApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  }

  async uploadVideo(file: File): Promise<{ id: number; filename: string; status: string }> {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${API_BASE_URL}/video_analyses/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }

  async analyzeVideo(id: number): Promise<{ id: number; status: string; results: VideoAnalysisResult }> {
    const response = await fetch(`${API_BASE_URL}/video_analyses/${id}/analyze`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
  }
}

export const videoAnalysisApi = new VideoAnalysisApi();