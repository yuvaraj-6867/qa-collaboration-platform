class Api::V1::ProjectsController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization

  def index
    projects = Project.all
    render json: projects
  end

  def show
    project = Project.find(params[:id])
    render json: project
  end

  def create
    project = Project.new(project_params)
    
    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors }, status: :unprocessable_entity
    end
  end

  def update
    project = Project.find(params[:id])
    
    if project.update(project_params)
      render json: project
    else
      render json: { errors: project.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    head :no_content
  end

  private

  def project_params
    params.require(:project).permit(:name, :description, :status)
  end
end
