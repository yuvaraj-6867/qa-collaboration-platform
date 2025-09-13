class AddEstimateToTickets < ActiveRecord::Migration[8.0]
  def change
    add_column :tickets, :estimate, :decimal, precision: 5, scale: 2
  end
end