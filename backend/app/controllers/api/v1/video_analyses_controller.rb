class Api::V1::VideoAnalysesController < ApplicationController
  def upload
    video_file = params[:video]
    return render json: { error: 'No video file' }, status: :bad_request if video_file.blank?

    analysis = VideoAnalysis.create!(
      user: current_user,
      filename: video_file.original_filename,
      status: 'uploaded'
    )
    analysis.video_file.attach(video_file)

    render json: { id: analysis.id, filename: analysis.filename, status: analysis.status }
  end

  def analyze
    analysis = VideoAnalysis.find(params[:id])
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless analysis.user == current_user

    analysis.update!(status: 'analyzing', analysis_results: nil)
    
    begin
      content = analysis.extract_content(force_regenerate: true)
      analysis.update!(status: 'completed', analysis_results: content)
      
      render json: { 
        id: analysis.id, 
        status: analysis.status, 
        results: content,
        filename: analysis.filename,
        processed_at: Time.current
      }
    rescue => e
      analysis.update!(status: 'failed')
      render json: { error: 'Analysis failed', details: e.message }, status: :internal_server_error
    end
  end

  def results
    analysis = VideoAnalysis.find(params[:id])
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless analysis.user == current_user

    render json: {
      id: analysis.id,
      filename: analysis.filename,
      status: analysis.status,
      results: analysis.analysis_results
    }
  end
end