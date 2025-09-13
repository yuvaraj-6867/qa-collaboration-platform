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
    (6.downto(0)).map do |days_ago|
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
    (6.downto(0)).map do |days_ago|
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
end