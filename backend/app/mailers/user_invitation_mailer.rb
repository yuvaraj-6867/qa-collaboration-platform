class UserInvitationMailer < ApplicationMailer
  default from: 'noreply@qa-platform.com'

  def invitation_email(invitation)
    @invitation = invitation
    @invited_by = invitation.invited_by
    mail(to: @invitation.email, subject: 'You have been invited to QA Platform')
  end
end