class ApplicationController < ActionController::API
  before_action :authenticate_request
  before_action :check_authorization

  private

  def authenticate_request
    return if request.method == 'OPTIONS'
    
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      decoded = JsonWebToken.decode(header)
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def check_authorization
    return if request.method == 'OPTIONS'
    return render json: { error: 'Unauthorized' }, status: :forbidden unless authorized?
  end

  def authorized?
    return false unless current_user
    return true if current_user.role == 'admin'
    
    case controller_name
    when 'dashboard'
      true
    when 'test_cases'
      case action_name
      when 'index', 'show'
        true
      when 'create', 'update'
        %w[qa_manager qa_engineer].include?(current_user.role)
      when 'destroy'
        current_user.role == 'qa_manager'
      else
        true
      end
    when 'tickets'
      true
    when 'automation_scripts'
      case action_name
      when 'index', 'show'
        %w[qa_manager qa_engineer].include?(current_user.role)
      when 'create', 'update', 'destroy'
        current_user.role == 'qa_manager'
      when 'execute'
        %w[qa_manager qa_engineer].include?(current_user.role)
      else
        true
      end
    when 'documents'
      true
    when 'analytics'
      case current_user.role
      when 'compliance_officer', 'qa_manager'
        action_name.in?(%w[index show])
      when 'developer'
        action_name == 'show'
      when 'qa_engineer'
        action_name == 'show'
      else
        false
      end
    when 'users'
      case action_name
      when 'index', 'show'
        true
      when 'create', 'update', 'destroy'
        false
      else
        false
      end
    when 'projects'
      %w[qa_manager developer qa_engineer].include?(current_user.role)
    else
      true
    end
  end
end
