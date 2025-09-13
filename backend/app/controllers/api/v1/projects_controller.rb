class Api::V1::ProjectsController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization

  def index
    render json: []
  end

  def show
    render json: {}
  end

  def create
    render json: { error: 'Projects not implemented' }, status: :not_implemented
  end

  def update
    render json: { error: 'Projects not implemented' }, status: :not_implemented
  end

  def destroy
    head :no_content
  end

  private

  def project_params
    params.require(:project).permit(:name, :description, :status)
  end
end
