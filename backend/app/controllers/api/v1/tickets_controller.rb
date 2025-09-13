class Api::V1::TicketsController < ApplicationController
  before_action :set_ticket, only: [:show, :update, :destroy]

  def index
    @tickets = Ticket.all
    render json: {
      tickets: @tickets.map { |ticket| ticket_json(ticket) }
    }
  end

  def show
    render json: { ticket: ticket_json(@ticket) }
  end

  def create
    @ticket = Ticket.create!(
      title: params[:title],
      description: params[:description],
      status: params[:status] || 'open',
      priority: params[:priority] || 'medium',
      issue_type: params[:issue_type] || 'bug',
      labels: params[:labels],
      assignee: params[:assignee],
      created_by_id: current_user&.id
    )
    render json: { ticket: ticket_json(@ticket) }, status: :created
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  def update
    if @ticket.update(ticket_params)
      render json: { ticket: ticket_json(@ticket) }
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @ticket.destroy
    head :no_content
  end

  private

  def set_ticket
    @ticket = Ticket.find(params[:id])
  end

  def ticket_params
    params.permit(:title, :description, :status, :priority, :issue_type, :labels, :assignee)
  end

  def ticket_json(ticket)
    {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      issue_type: ticket.issue_type,
      labels: ticket.labels,
      assignee: ticket.assignee,
      created_by_id: ticket.created_by_id,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    }
  end
end
