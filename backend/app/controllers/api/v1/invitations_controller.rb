class Api::V1::InvitationsController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization

  def send_invitation
    email = params[:email]
    first_name = params[:first_name]
    last_name = params[:last_name]
    role = params[:role]
    inviter_name = params[:inviter_name]

    # Send email using ActionMailer
    InvitationMailer.send_invitation(
      email: email,
      first_name: first_name,
      last_name: last_name,
      role: role,
      inviter_name: inviter_name
    ).deliver_now

    render json: { 
      message: 'Invitation sent successfully',
      email: email,
      recipient: "#{first_name} #{last_name}",
      role: role
    }, status: :ok
  rescue => e
    render json: { error: 'Failed to send invitation email' }, status: :internal_server_error
  end
end