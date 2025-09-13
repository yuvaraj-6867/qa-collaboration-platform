class TestRun < ApplicationRecord
  validates :status, inclusion: { in: %w[pending running passed failed blocked skipped] }
  validates :execution_time, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  belongs_to :test_case
  belongs_to :user
  belongs_to :automation_script, optional: true
  has_many :tickets, dependent: :nullify
  has_one_attached :screenshot
  has_one_attached :video

  scope :recent, -> { order(created_at: :desc) }
  scope :passed, -> { where(status: 'passed') }
  scope :failed, -> { where(status: 'failed') }
  scope :automated, -> { where.not(automation_script_id: nil) }
  scope :manual, -> { where(automation_script_id: nil) }

  after_update :update_test_case_status, if: :saved_change_to_status?
  after_create :create_failure_ticket, if: -> { failed? && automated? }

  def passed?
    status == 'passed'
  end

  def failed?
    status == 'failed'
  end

  def automated?
    automation_script_id.present?
  end

  def duration_in_seconds
    execution_time || 0
  end

  def evidence_files
    {
      screenshot: screenshot.attached? ? screenshot : nil,
      video: video.attached? ? video : nil
    }
  end

  private

  def update_test_case_status
    test_case.update_status_from_run(status)
  end

  def create_failure_ticket
    Ticket.create!(
      title: "Automated Test Failure: #{test_case.title}",
      description: "Test case '#{test_case.title}' failed during automated execution.\n\nNotes: #{notes}",
      status: 'open',
      priority: 'high',
      severity: 'major',
      test_case: test_case,
      test_run: self,
      created_by: user
    )
  end
end