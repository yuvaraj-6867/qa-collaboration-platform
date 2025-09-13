class Api::V1::DocumentsController < ApplicationController
  before_action :set_document, only: [:show, :update, :destroy, :download]
  skip_before_action :check_authorization

  def index
    @documents = Document.includes(:user, :folder)
                        .page(params[:page])
                        .per(params[:per_page] || 20)
    
    @documents = @documents.by_folder(params[:folder_id]) if params[:folder_id]
    @documents = @documents.by_tags(params[:tags].split(',')) if params[:tags]
    
    render json: {
      documents: @documents.map { |doc| document_json(doc) },
      meta: pagination_meta(@documents)
    }
  end

  def show
    render json: { document: document_json(@document) }
  end

  def create
    @document = Document.new(document_params)
    @document.user = current_user
    @document.version = '1.0'

    if @document.save
      render json: { document: document_json(@document) }, status: :created
    else
      render json: { errors: @document.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @document.update(document_params)
      render json: { document: document_json(@document) }
    else
      render json: { errors: @document.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @document.destroy
    head :no_content
  end

  def download
    if @document.file.attached?
      redirect_to rails_blob_path(@document.file, disposition: 'attachment')
    else
      render json: { error: 'File not found' }, status: :not_found
    end
  end

  private

  def set_document
    @document = Document.find(params[:id])
  end

  def document_params
    params.require(:document).permit(:title, :description, :folder_id, :file, tag_list: [])
  end

  def document_json(document)
    {
      id: document.id,
      title: document.title,
      description: document.description,
      file_size: document.file_size_human,
      content_type: document.content_type,
      version: document.version,
      tags: document.tag_list,
      folder: document.folder&.name,
      uploaded_by: document.user.full_name,
      created_at: document.created_at,
      updated_at: document.updated_at
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