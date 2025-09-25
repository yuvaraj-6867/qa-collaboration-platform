class VideoScriptGenerator
  def self.generate_script(video_path, filename)
    # Analyze real video content
    RealVideoAnalyzer.analyze_real_video(video_path, filename)
  end

  private

  def self.generate_title(filename)
    base_name = File.basename(filename, ".*").gsub(/[-_]/, " ")
    "Video Script: #{base_name.titleize}"
  end

  def self.generate_summary(video_path, filename)
    duration = get_video_duration(video_path)
    "This #{duration.round(1)}-second video demonstrates user interactions and interface navigation. " \
    "The recording captures screen activity and user workflow for documentation purposes."
  end

  def self.generate_full_script(video_path, filename)
    duration = get_video_duration(video_path)
    actions = analyze_video_actions(video_path, filename)
    
    script_parts = []
    script_parts << "[INTRO]"
    script_parts << "Welcome to this screen recording demonstration."
    script_parts << ""
    
    script_parts << "[MAIN CONTENT]"
    actions.each_with_index do |action, index|
      timestamp = (duration * index / [actions.length - 1, 1].max).round(1)
      script_parts << "At #{timestamp}s: #{action}"
    end
    script_parts << ""
    
    script_parts << "[CONCLUSION]"
    script_parts << "This completes the demonstration of the user workflow."
    script_parts << "Total duration: #{duration.round(1)} seconds"
    
    script_parts.join("\n")
  end

  def self.generate_timestamp_actions(video_path)
    duration = get_video_duration(video_path)
    return [] if duration <= 0
    
    intervals = [duration / 4, 1].max
    timestamps = []
    
    (0..duration).step(intervals) do |time|
      minutes = (time / 60).to_i
      seconds = (time % 60).to_i
      timestamp = sprintf("%02d:%02d", minutes, seconds)
      
      action = case time
      when 0
        "Video begins - Initial screen state"
      when duration * 0.25
        "User starts interaction"
      when duration * 0.5
        "Main action performed"
      when duration * 0.75
        "Workflow continues"
      else
        "Action in progress"
      end
      
      timestamps << "[#{timestamp}] #{action}"
    end
    
    timestamps
  end

  def self.generate_narrator_script(video_path, filename)
    duration = get_video_duration(video_path)
    
    narrator_script = []
    narrator_script << "In this #{duration.round(1)}-second demonstration,"
    
    if filename.downcase.include?('login')
      narrator_script << "we observe a user authentication process."
      narrator_script << "The user navigates to the login interface and enters credentials."
    elsif filename.downcase.include?('dashboard')
      narrator_script << "we see dashboard navigation and interface interaction."
      narrator_script << "The user explores various dashboard components and features."
    else
      narrator_script << "we witness user interface interactions and workflow execution."
      narrator_script << "The recording captures typical user behavior patterns."
    end
    
    narrator_script << "This documentation serves as a reference for user experience analysis."
    narrator_script.join(" ")
  end

  def self.analyze_video_actions(video_path, filename)
    duration = get_video_duration(video_path)
    base_actions = []
    
    # Generate actions based on filename
    if filename.downcase.include?('login')
      base_actions = [
        "User opens login page",
        "Username field is clicked",
        "User types username",
        "Password field is selected", 
        "User enters password",
        "Login button is clicked",
        "Authentication process completes"
      ]
    elsif filename.downcase.include?('dashboard')
      base_actions = [
        "Dashboard page loads",
        "User views main interface",
        "Navigation menu is explored",
        "User clicks on menu items",
        "Content areas are reviewed",
        "User completes dashboard tour"
      ]
    else
      base_actions = [
        "Screen recording begins",
        "User interface is displayed",
        "User performs primary action",
        "Interface responds to input",
        "Workflow progresses",
        "Task completion achieved"
      ]
    end
    
    # Adjust number of actions based on duration
    if duration < 5
      base_actions.first(3)
    elsif duration < 15
      base_actions.first(5)
    else
      base_actions
    end
  end

  def self.get_video_duration(video_path)
    duration_cmd = "ffprobe -v quiet -show_entries format=duration -of csv=p=0 #{video_path.shellescape} 2>/dev/null"
    `#{duration_cmd}`.to_f
  rescue
    0
  end
end