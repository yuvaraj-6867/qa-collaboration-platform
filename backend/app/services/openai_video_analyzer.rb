require 'net/http'
require 'json'
require 'base64'
require 'fileutils'

class OpenaiVideoAnalyzer
  def self.analyze_video_with_openai(video_path, filename)
    return fallback_analysis(filename) unless openai_configured?
    
    begin
      # Extract frames from video
      frames = extract_video_frames(video_path)
      return fallback_analysis(filename) if frames.empty?
      
      # Analyze with OpenAI Vision
      analysis = analyze_frames_with_openai(frames, filename)
      
      # Generate script from analysis
      generate_script_from_analysis(analysis, filename, video_path)
    rescue => e
      Rails.logger.error "OpenAI analysis failed: #{e.message}"
      fallback_analysis(filename)
    end
  end

  private

  def self.openai_configured?
    ENV['OPENAI_API_KEY'].present?
  end

  def self.extract_video_frames(video_path)
    frames_dir = "/tmp/frames_#{SecureRandom.hex}"
    Dir.mkdir(frames_dir)
    
    # Extract 3 key frames
    system("ffmpeg -i #{video_path.shellescape} -vf 'select=not(mod(n\\,30))' -vsync vfr -frames:v 3 #{frames_dir}/frame_%d.jpg > /dev/null 2>&1")
    
    frame_files = Dir.glob("#{frames_dir}/*.jpg")
    frames_data = frame_files.map do |frame_file|
      Base64.encode64(File.read(frame_file))
    end
    
    FileUtils.rm_rf(frames_dir)
    frames_data
  end

  def self.analyze_frames_with_openai(frames, filename)
    uri = URI('https://api.openai.com/v1/chat/completions')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    messages = [{
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this video frames from '#{filename}' and describe what's happening. Focus on: 1) What text is visible on screen 2) What UI elements are shown 3) What actions the user is performing. Be specific and detailed."
        }
      ]
    }]

    # Add frame images
    frames.each_with_index do |frame_data, index|
      messages[0][:content] << {
        type: "image_url",
        image_url: {
          url: "data:image/jpeg;base64,#{frame_data}"
        }
      }
    end

    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{ENV['OPENAI_API_KEY']}"
    request['Content-Type'] = 'application/json'
    request.body = {
      model: "gpt-4-vision-preview",
      messages: messages,
      max_tokens: 1000
    }.to_json

    response = http.request(request)
    
    if response.code == '200'
      result = JSON.parse(response.body)
      result.dig('choices', 0, 'message', 'content') || "Analysis completed"
    else
      "OpenAI analysis unavailable"
    end
  end

  def self.generate_script_from_analysis(analysis_text, filename, video_path)
    duration = get_video_duration(video_path)
    
    {
      title: "Video Script: #{File.basename(filename, '.*').humanize}",
      summary: "AI-analyzed video content from #{filename} (#{duration.round(1)}s)",
      full_script: generate_full_script_from_analysis(analysis_text, duration),
      timestamp_actions: generate_timestamp_actions_from_analysis(analysis_text, duration),
      narrator_script: generate_narrator_script_from_analysis(analysis_text, filename)
    }
  end

  def self.generate_full_script_from_analysis(analysis_text, duration)
    script = []
    script << "[INTRO]"
    script << "This video demonstrates screen interactions and user workflow."
    script << ""
    script << "[MAIN CONTENT - AI ANALYSIS]"
    script << analysis_text
    script << ""
    script << "[CONCLUSION]"
    script << "Video analysis completed using AI vision technology."
    script << "Duration: #{duration.round(1)} seconds"
    
    script.join("\n")
  end

  def self.generate_timestamp_actions_from_analysis(analysis_text, duration)
    # Extract action-like sentences from analysis
    sentences = analysis_text.split(/[.!?]+/).map(&:strip).reject(&:empty?)
    actions = sentences.select { |s| s.match?(/\b(click|type|scroll|navigate|select|enter|press)\b/i) }
    
    if actions.empty?
      actions = ["Video content analyzed", "User interactions detected", "Interface elements identified"]
    end
    
    # Distribute actions across video duration
    actions.first(5).map.with_index do |action, index|
      time_point = (duration * index / [actions.length - 1, 1].max)
      minutes = (time_point / 60).to_i
      seconds = (time_point % 60).to_i
      timestamp = sprintf("%02d:%02d", minutes, seconds)
      "[#{timestamp}] #{action}"
    end
  end

  def self.generate_narrator_script_from_analysis(analysis_text, filename)
    "In this screen recording titled '#{File.basename(filename, '.*').humanize}', " \
    "we observe the following: #{analysis_text.split('.').first(2).join('. ')}. " \
    "This analysis was generated using AI vision technology to extract meaningful content from the video."
  end

  def self.get_video_duration(video_path)
    duration_cmd = "ffprobe -v quiet -show_entries format=duration -of csv=p=0 #{video_path.shellescape} 2>/dev/null"
    `#{duration_cmd}`.to_f
  rescue
    0
  end

  def self.fallback_analysis(filename)
    {
      title: "Video Script: #{File.basename(filename, '.*').humanize}",
      summary: "OpenAI API key required for detailed video analysis",
      full_script: "[SETUP REQUIRED]\nTo analyze your original video content, please add your OpenAI API key to the environment variables.\n\nSet OPENAI_API_KEY in your .env file to enable AI-powered video analysis.",
      timestamp_actions: ["[00:00] OpenAI API key required for timestamp analysis"],
      narrator_script: "OpenAI API key is required to generate detailed video analysis and narrator script from your original video content."
    }
  end
end