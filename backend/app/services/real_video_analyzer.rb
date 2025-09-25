require 'open3'

class RealVideoAnalyzer
  def self.analyze_real_video(video_path, filename)
    temp_dir = "/tmp/frames_#{SecureRandom.hex}"
    Dir.mkdir(temp_dir)
    
    system("ffmpeg -i '#{video_path}' -vf 'fps=1' '#{temp_dir}/frame_%03d.png' > /dev/null 2>&1")
    
    urls = []
    buttons = []
    values = []
    steps = []
    
    all_text = []
    
    Dir.glob("#{temp_dir}/*.png").sort.each_with_index do |frame_file, i|
      text = `tesseract '#{frame_file}' stdout`.strip
      all_text << "Frame #{i+1}: #{text}" if text.length > 0
      
      # Extract everything from text
      text.scan(/https?:\/\/[^\s]+/i).each { |url| urls << url }
      text.scan(/www\.[a-zA-Z0-9.-]+/i).each { |url| urls << "https://#{url}" }
      
      text.split(/\s+/).each do |word|
        buttons << word if word.length > 2 && word.match?(/^[A-Za-z]+$/)
      end
      
      text.scan(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/).each { |email| values << { field: 'email', value: email[0] } }
      text.scan(/([a-zA-Z0-9_]{2,})/).each { |val| values << { field: 'text', value: val[0] } }
    end
    
    Rails.logger.info "OCR Text: #{all_text.join(' | ')}"
    
    FileUtils.rm_rf(temp_dir)
    
    urls_visited = urls.uniq
    buttons_clicked = buttons.uniq
    values_entered = values.uniq { |v| v[:value] }
    
    {
      title: "Video Analysis",
      description: "URLs visited: #{urls_visited.join(', ')}\nButtons clicked: #{buttons_clicked.join(', ')}\nValues entered: #{values_entered.map { |v| "#{v[:field]}: #{v[:value]}" }.join(', ')}",
      preconditions: "System ready",
      test_steps: "1. URLs visited: #{urls_visited.join(', ')}\n2. Buttons clicked: #{buttons_clicked.join(', ')}\n3. Values entered: #{values_entered.map { |v| "#{v[:field]}: #{v[:value]}" }.join(', ')}",
      expected_results: "Actions completed",
      priority: 'Medium',
      status: 'Draft',
      video_source: filename,
      extracted_steps: ["URLs visited: #{urls_visited.join(', ')}", "Buttons clicked: #{buttons_clicked.join(', ')}", "Values entered: #{values_entered.map { |v| "#{v[:field]}: #{v[:value]}" }.join(', ')}"],
      extracted_urls: urls_visited,
      extracted_values: values_entered
    }
  end
end