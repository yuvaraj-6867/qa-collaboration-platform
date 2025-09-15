class Api::V1::AuthDebugController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization

  def status
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token.blank?
      render json: { 
        authenticated: false, 
        error: 'No token provided',
        headers: request.headers.to_h.select { |k, v| k.downcase.include?('auth') }
      }
      return
    end

    begin
      decoded = JsonWebToken.decode(token)
      user = User.find(decoded[:user_id])
      
      render json: {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token_valid: true,
        decoded_payload: decoded
      }
    rescue JWT::DecodeError => e
      render json: {
        authenticated: false,
        error: "Invalid token: #{e.message}",
        token_provided: token.present?
      }
    rescue ActiveRecord::RecordNotFound
      render json: {
        authenticated: false,
        error: 'User not found',
        token_valid: false
      }
    end
  end

  def test_token
    user = User.first
    if user
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    else
      render json: { error: 'No users found' }
    end
  end
end