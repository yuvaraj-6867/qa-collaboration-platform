class User < ApplicationRecord
  has_secure_password

  ROLES = %w[developer tester manager admin].freeze

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, :last_name, presence: true
  validates :role, inclusion: { in: ROLES }
  validates :status, inclusion: { in: %w[active inactive suspended] }

  has_many :created_test_cases, class_name: 'TestCase', foreign_key: 'created_by_id'
  has_many :assigned_test_cases, class_name: 'TestCase', foreign_key: 'assigned_user_id'
  has_many :created_tickets, class_name: 'Ticket', foreign_key: 'created_by_id'
  has_many :assigned_tickets, class_name: 'Ticket', foreign_key: 'assigned_user_id'
  has_many :test_runs
  has_many :notifications, dependent: :destroy
  has_one :user_setting, dependent: :destroy

  scope :active, -> { where(status: 'active') }

  def setting
    user_setting || build_user_setting(UserSetting.default_settings)
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end

  def developer?
    role == 'developer'
  end

  def tester?
    role == 'tester'
  end

  # Permission methods
  def can_access?(feature)
    permissions = {
      'developer' => %w[dashboard tickets],
      'tester' => %w[dashboard test-cases automation tickets documents analytics],
      'manager' => %w[dashboard test-cases automation tickets documents analytics],
      'admin' => %w[dashboard test-cases automation tickets documents analytics users]
    }
    permissions[role]&.include?(feature.to_s) || false
  end
end
