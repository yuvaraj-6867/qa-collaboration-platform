class Api::V1::UserInvitationsController < ApplicationController
  def create
    Rails.logger.info "Creating invitation with params: #{params.inspect}"
    Rails.logger.info "Current user: #{current_user.inspect}"
    
    invitation = UserInvitation.create!(
      email: params[:email],
      role: params[:role],
      invited_by: current_user
    )
    
    render json: { message: 'Invitation sent successfully', invitation: invitation }
  rescue => e
    Rails.logger.error "Invitation creation failed: #{e.message}"
    render json: { error: e.message }, status: :unprocessable_entity
  end
end