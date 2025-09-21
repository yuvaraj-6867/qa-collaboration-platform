class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization
  before_action :check_rate_limit, only: [:login, :register]

  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      user.update(last_activity_at: Time.current)
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      }
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def register
    # Handle nested authentication parameters
    auth_params = params[:authentication] || params
    
    # Check if confirm_password is provided and matches
    if auth_params[:confirm_password].present? && auth_params[:password] != auth_params[:confirm_password]
      return render json: { error: 'Password and confirmation do not match' }, status: :unprocessable_entity
    end
    
    user = User.new(user_params.merge(role: 'qa_engineer', status: 'active'))
    
    if user.save
      render json: { 
        message: 'User created successfully. Please sign in.',
        redirect_to_signin: true 
      }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  def logout
    head :no_content
  end

  def change_password
    unless current_user.authenticate(params[:current_password])
      return render json: { error: 'Current password is incorrect' }, status: :unauthorized
    end

    if params[:new_password] != params[:confirm_password]
      return render json: { error: 'New password and confirmation do not match' }, status: :unprocessable_entity
    end

    if current_user.update(password: params[:new_password])
      render json: { message: 'Password updated successfully' }
    else
      render json: { errors: current_user.errors }, status: :unprocessable_entity
    end
  end

  def dev_token
    return head :not_found unless Rails.env.development?
    
    user = User.first
    if user
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, email: user.email } }
    else
      render json: { error: 'No users found' }, status: :not_found
    end
  end

  private

  def check_rate_limit
    cache_key = "rate_limit:#{request.remote_ip}"
    attempts = Rails.cache.read(cache_key) || 0
    
    if attempts >= 5
      render json: { error: 'Too many attempts. Try again later.' }, status: :too_many_requests
      return
    end
    
    Rails.cache.write(cache_key, attempts + 1, expires_in: 1.minute)
  end

  def user_params
    # Handle both flat and nested parameter structures
    auth_params = params[:authentication] || params
    auth_params.permit(:email, :password, :first_name, :last_name, :role, :phone, :location)
  end
end
