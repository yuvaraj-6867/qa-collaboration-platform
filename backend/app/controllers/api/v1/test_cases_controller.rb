class Api::V1::TestCasesController < ApplicationController
  skip_before_action :authenticate_request
  skip_before_action :check_authorization
  before_action :set_test_case, only: [:show, :update, :destroy]

  def index
    @test_cases = TestCase.includes(:assigned_user, :created_by, :folder)
                          .page(params[:page])
                          .per(params[:per_page] || 20)
    
    @test_cases = @test_cases.where(folder_id: params[:folder_id]) if params[:folder_id]
    @test_cases = @test_cases.where(status: params[:status]) if params[:status]
    
    render json: {
      test_cases: @test_cases.map { |tc| test_case_json(tc) },
      meta: pagination_meta(@test_cases)
    }
  end

  def show
    render json: { test_case: test_case_json(@test_case) }
  end

  def create
    @test_case = TestCase.create!(
      title: params[:test_case][:title],
      description: params[:test_case][:description],
      preconditions: params[:test_case][:preconditions],
      steps: params[:test_case][:steps],
      expected_results: params[:test_case][:expected_results],
      test_data: params[:test_case][:test_data],
      priority: params[:test_case][:priority],
      status: params[:test_case][:status] || 'draft',
      created_by_id: current_user&.id
    )
    render json: { test_case: @test_case }, status: :created
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  def update
    if @test_case.update(test_case_params)
      render json: { test_case: test_case_json(@test_case) }
    else
      render json: { errors: @test_case.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @test_case.destroy
    head :no_content
  end

  private

  def set_test_case
    @test_case = TestCase.find(params[:id])
  end

  def test_case_params
    params.require(:test_case).permit(
      :title, :description, :preconditions, :expected_results, 
      :test_data, :priority, :status, :assigned_user_id, 
      :folder_id, :created_by_id, steps: []
    )
  end

  def test_case_json(test_case)
    {
      id: test_case.id,
      title: test_case.title,
      description: test_case.description,
      preconditions: test_case.preconditions,
      steps: test_case.steps,
      expected_results: test_case.expected_results,
      test_data: test_case.test_data,
      priority: test_case.priority,
      status: test_case.status,
      assigned_user_id: test_case.assigned_user_id,
      created_by_id: test_case.created_by_id,
      folder_id: test_case.folder_id,
      project_id: test_case.project_id,
      project_name: test_case.project&.name,
      attachments: test_case.test_case_attachments.map { |att| attachment_json(att) },
      created_at: test_case.created_at,
      updated_at: test_case.updated_at
    }
  end

  def attachment_json(attachment)
    {
      id: attachment.id,
      filename: attachment.filename,
      content_type: attachment.content_type,
      attachment_type: attachment.attachment_type,
      file_url: attachment.file_url
    }
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
