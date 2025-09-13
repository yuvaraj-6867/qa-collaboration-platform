class AddTestReferencesToTickets < ActiveRecord::Migration[8.0]
  def change
    add_reference :tickets, :test_case, null: true, foreign_key: true
    add_reference :tickets, :test_run, null: true, foreign_key: true
  end
end
