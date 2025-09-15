class InvitationMailer < ApplicationMailer
  default from: 'noreply@qa-platform.com'

  def send_invitation(email:, first_name:, last_name:, role:, inviter_name:)
    @first_name = first_name
    @last_name = last_name
    @role = role
    @inviter_name = inviter_name
    @invitation_link = "https://qa-platform.com/invite/accept?token=#{generate_token}"

    mail(
      to: email,
      subject: 'Invitation to join QA Collaboration Platform'
    )
  end

  private

  def generate_token
    SecureRandom.urlsafe_base64(32)
  end
end