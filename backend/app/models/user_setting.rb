class UserSetting < ApplicationRecord
  belongs_to :user

  validates :theme, inclusion: { in: %w[light dark system] }
  validates :language, inclusion: { in: %w[en es fr de ja] }
  validates :timezone, presence: true

  def self.default_settings
    {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      notifications_enabled: true,
      email_notifications: true,
      compact_view: false
    }
  end
end