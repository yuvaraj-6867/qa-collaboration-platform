require 'securerandom'

class UserInvitation < ApplicationRecord
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, presence: true
  validates :status, inclusion: { in: %w[pending accepted declined] }
  
  belongs_to :invited_by, class_name: 'User'
  
  before_create :generate_token
  after_create :create_invitation_notification
  
  def expired?
    expires_at < Time.current
  end
  
  private
  
  def generate_token
    self.token = SecureRandom.hex(16)
    self.expires_at = 7.days.from_now
  end
  
  def create_invitation_notification
    NotificationService.create_notification(
      user: invited_by,
      title: "User Invited",
      message: "Invitation sent to #{email}",
      type: 'success'
    )
    
    # Send email with detailed error logging
    begin
      UserInvitationMailer.invitation_email(self).deliver_now
      puts "📧 Email invitation sent to: #{email}"
    rescue Net::SMTPAuthenticationError => e
      puts "❌ SMTP Authentication failed: #{e.message}"
      puts "Check Gmail username/password in .env file"
    rescue Net::SMTPServerBusy => e
      puts "❌ SMTP Server busy: #{e.message}"
    rescue => e
      puts "❌ Email failed: #{e.class} - #{e.message}"
    end
  end
end