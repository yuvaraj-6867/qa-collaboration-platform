class Api::V1::DashboardController < ApplicationController
  skip_before_action :check_authorization
  def metrics
    render json: {
      test_metrics: test_metrics,
      ticket_metrics: ticket_metrics,
      automation_metrics: automation_metrics,
      document_metrics: document_metrics
    }
  end

  def recent_activity
    activities = []
    
    TestRun.includes(:test_case, :user).recent.limit(5).each do |run|
      activities << {
        type: 'test_run',
        message: "Test '#{run.test_case.title}' #{run.status}",
        user: run.user.full_name,
        timestamp: run.created_at
      }
    end

    Ticket.includes(:created_by).order(created_at: :desc).limit(5).each do |ticket|
      activities << {
        type: 'ticket',
        message: "Ticket '#{ticket.title}' created",
        user: ticket.created_by.full_name,
        timestamp: ticket.created_at
      }
    end

    render json: { activities: activities.sort_by { |a| a[:timestamp] }.reverse }
  end

  def trends
    render json: {
      pass_fail_trend: pass_fail_trend,
      ticket_trend: ticket_trend
    }
  end

  def user_activity
    users = User.includes(:created_test_cases, :created_tickets, :test_runs)
                .select(:id, :first_name, :last_name, :email, :role, :status, :last_activity_at, :created_at)
                .limit(10)
    
    user_activities = users.map do |user|
      recent_activity = get_user_recent_activity(user)
      {
        id: user.id,
        name: "#{user.first_name} #{user.last_name}",
        initials: "#{user.first_name&.first}#{user.last_name&.first}".upcase,
        email: user.email,
        role: user.role,
        status: determine_user_status(user),
        activity: recent_activity[:message],
        active_time: calculate_active_time(user),
        last_seen: format_last_seen(user.last_activity_at),
        progress: recent_activity[:progress]
      }
    end

    render json: {
      online_users: users.count { |u| determine_user_status(u) == 'online' },
      today_active: users.count { |u| u.last_activity_at&.> 1.day.ago },
      week_active: users.count { |u| u.last_activity_at&.> 1.week.ago },
      users: user_activities
    }
  end

  private

  def test_metrics
    {
      total_test_cases: TestCase.count,
      active_test_cases: TestCase.active.count,
      pass_rate: calculate_pass_rate,
      recent_runs: TestRun.where('created_at > ?', 7.days.ago).count
    }
  end

  def ticket_metrics
    {
      total_tickets: Ticket.count,
      open_tickets: Ticket.open.count,
      closed_tickets: Ticket.closed.count,
      critical_tickets: Ticket.where(priority: 'critical').count
    }
  end

  def automation_metrics
    {
      automation_coverage: calculate_automation_coverage,
      automated_runs: TestRun.joins(:automation_script).where('test_runs.created_at > ?', 7.days.ago).count,
      manual_runs: TestRun.where(automation_script_id: nil).where('created_at > ?', 7.days.ago).count
    }
  end

  def document_metrics
    {
      total_documents: Document.count,
      recent_uploads: Document.where('created_at > ?', 7.days.ago).count
    }
  end

  def pass_fail_trend
    (4.downto(0)).map do |days_ago|
      date = days_ago.days.ago.to_date
      runs = TestRun.where(created_at: date.beginning_of_day..date.end_of_day)
      {
        date: date.strftime('%m/%d'),
        passed: runs.passed.count,
        failed: runs.failed.count
      }
    end
  end

  def ticket_trend
    (4.downto(0)).map do |days_ago|
      date = days_ago.days.ago.to_date
      tickets = Ticket.where(created_at: date.beginning_of_day..date.end_of_day)
      {
        date: date.strftime('%m/%d'),
        opened: tickets.count,
        closed: tickets.closed.count
      }
    end
  end

  def calculate_pass_rate
    total_runs = TestRun.count
    return 0 if total_runs.zero?
    
    passed_runs = TestRun.passed.count
    (passed_runs.to_f / total_runs * 100).round(2)
  end

  def calculate_automation_coverage
    total_cases = TestCase.active.count
    return 0 if total_cases.zero?
    
    automated_cases = TestCase.joins(:automation_scripts).where(automation_scripts: { status: 'active' }).distinct.count
    (automated_cases.to_f / total_cases * 100).round(2)
  end

  def get_user_recent_activity(user)
    recent_test_cases = user.created_test_cases.where('created_at > ?', 1.day.ago).count
    recent_tickets = user.created_tickets.where('created_at > ?', 1.day.ago).count
    recent_runs = user.test_runs.where('created_at > ?', 1.day.ago).count
    
    if recent_test_cases > 0
      { message: "Created #{recent_test_cases} test case#{'s' if recent_test_cases > 1}", progress: [recent_test_cases * 20, 100].min }
    elsif recent_tickets > 0
      { message: "Updated #{recent_tickets} ticket#{'s' if recent_tickets > 1}", progress: [recent_tickets * 15, 100].min }
    elsif recent_runs > 0
      { message: "Ran #{recent_runs} test#{'s' if recent_runs > 1}", progress: [recent_runs * 10, 100].min }
    else
      { message: 'No recent activity', progress: 5 }
    end
  end

  def determine_user_status(user)
    return 'offline' unless user.last_activity_at
    
    if user.last_activity_at > 5.minutes.ago
      'online'
    elsif user.last_activity_at > 30.minutes.ago
      'away'
    else
      'offline'
    end
  end

  def calculate_active_time(user)
    return '0m' unless user.last_activity_at
    
    if user.last_activity_at > 1.day.ago
      time_diff = Time.current - user.last_activity_at
      hours = (time_diff / 1.hour).to_i
      minutes = ((time_diff % 1.hour) / 1.minute).to_i
      
      if hours > 0
        "#{hours}h #{minutes}m"
      else
        "#{minutes}m"
      end
    else
      '0m'
    end
  end

  def format_last_seen(last_activity)
    return 'Never' unless last_activity
    
    time_ago = Time.current - last_activity
    
    if time_ago < 1.minute
      'Now'
    elsif time_ago < 1.hour
      "#{(time_ago / 1.minute).to_i}m ago"
    elsif time_ago < 1.day
      "#{(time_ago / 1.hour).to_i}h ago"
    else
      "#{(time_ago / 1.day).to_i}d ago"
    end
  end
end