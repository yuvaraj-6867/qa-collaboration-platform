class Api::TicketsController < ApplicationController
  before_action :set_ticket, only: [:show, :update, :destroy]

  def index
    tickets = Ticket.includes(:assigned_user, :created_by, :labels)
    
    # Group by status for Kanban board
    kanban_data = {
      to_do: format_tickets(tickets.by_status('to_do')),
      in_progress: format_tickets(tickets.by_status('in_progress')),
      in_review: format_tickets(tickets.by_status('in_review')),
      qa_ready: format_tickets(tickets.by_status('qa_ready')),
      done: format_tickets(tickets.by_status('done'))
    }

    render json: {
      kanban: kanban_data,
      totals: {
        to_do: tickets.by_status('to_do').count,
        in_progress: tickets.by_status('in_progress').count,
        in_review: tickets.by_status('in_review').count,
        qa_ready: tickets.by_status('qa_ready').count,
        done: tickets.by_status('done').count
      }
    }
  end

  def show
    render json: ticket_json(@ticket)
  end

  def create
    @ticket = Ticket.new(ticket_params)
    @ticket.created_by = current_user

    if @ticket.save
      render json: ticket_json(@ticket), status: :created
    else
      render json: { errors: @ticket.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @ticket.update(ticket_params)
      render json: ticket_json(@ticket)
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
    params.require(:ticket).permit(:title, :description, :status, :priority, :severity, 
                                   :assigned_user_id, :test_case_id, :estimate)
  end

  def format_tickets(tickets)
    tickets.map { |ticket| ticket_json(ticket) }
  end

  def ticket_json(ticket)
    {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      severity: ticket.severity,
      estimate: ticket.estimate_total,
      assigned_user: ticket.assigned_user&.full_name,
      created_by: ticket.created_by.full_name,
      labels: ticket.labels.map { |l| { name: l.name, color: l.color } },
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    }
  end
end