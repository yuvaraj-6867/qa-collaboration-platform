class Api::V1::SettingsController < ApplicationController
  def show
    settings = current_user.user_setting || current_user.build_user_setting
    render json: settings
  end

  def update
    settings = current_user.user_setting || current_user.build_user_setting
    
    if settings.update(settings_params)
      render json: settings
    else
      render json: { errors: settings.errors }, status: :unprocessable_entity
    end
  end

  private

  def settings_params
    params.permit(:theme, :notifications_enabled, :email_notifications, :language, :timezone)
  end
end