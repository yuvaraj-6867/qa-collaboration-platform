class VideoAnalysis < ApplicationRecord
  belongs_to :user
  has_one_attached :video_file

  validates :filename, presence: true
  validates :status, inclusion: { in: %w[uploaded analyzing completed failed] }

  def extract_content(force_regenerate: false)
    return cached_results if analysis_results.present? && !force_regenerate
    
    video_path = get_video_path
    return fallback_content unless video_path
    
    # Use real video analyzer - no mock data
    real_analysis = RealVideoAnalyzer.analyze_real_video(video_path, filename)
    
    {
      title: real_analysis[:title],
      description: real_analysis[:description],
      preconditions: real_analysis[:preconditions],
      test_steps: real_analysis[:test_steps],
      expected_results: real_analysis[:expected_results],
      priority: real_analysis[:priority],
      status: real_analysis[:status],
      video_source: real_analysis[:video_source]
    }
  end

  private

  def cached_results
    analysis_results.symbolize_keys
  end

  def get_video_path
    return nil unless video_file.attached?
    video_file.blob.service.path_for(video_file.blob.key)
  rescue
    nil
  end

  def fallback_content
    {
      title: "Video Analysis Failed: #{filename}",
      description: "Could not analyze video - ffmpeg and tesseract required",
      preconditions: "Install video analysis tools",
      test_steps: "No steps extracted from video",
      expected_results: "No results available",
      priority: "Low",
      status: "Failed",
      video_source: filename
    }
  end
end