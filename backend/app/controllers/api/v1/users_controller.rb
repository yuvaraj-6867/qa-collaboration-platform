class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.select(:id, :email, :first_name, :last_name, :role, :status, :phone, :location, :joined_date, :created_at)
    render json: @users
  end

  def current
    render json: {
      id: current_user.id,
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      role: current_user.role,
      permissions: get_user_permissions(current_user.role)
    }
  end

  def show
    render json: @user
  end

  def create
    @user = User.new(user_params)
    
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :role, :status, :phone, :location, :joined_date)
  end

  def get_user_permissions(role)
    case role
    when 'admin'
      ['all']
    when 'qa_manager'
      ['test_cases', 'tickets', 'automation', 'documents', 'analytics', 'users']
    when 'qa_engineer'
      ['test_cases', 'tickets', 'documents', 'analytics']
    when 'developer'
      ['test_cases', 'tickets', 'documents', 'analytics']
    when 'compliance_officer'
      ['test_cases', 'tickets', 'documents', 'analytics', 'users']
    else
      []
    end
  end
end
