class Api::V1::NotificationsController < ApplicationController
  def index
    notifications = [
      {
        id: 1,
        title: "Test Case Updated",
        message: "Test case TC-001 has been updated by QA Manager",
        type: "info",
        read: false,
        created_at: 1.hour.ago
      },
      {
        id: 2,
        title: "Automation Script Completed",
        message: "Login automation script executed successfully",
        type: "success",
        read: false,
        created_at: 2.hours.ago
      },
      {
        id: 3,
        title: "Ticket Assigned",
        message: "Bug #123 has been assigned to you",
        type: "warning",
        read: true,
        created_at: 1.day.ago
      }
    ]
    
    render json: notifications
  end

  def read
    # Mark notification as read
    render json: { status: 'success' }
  end
end