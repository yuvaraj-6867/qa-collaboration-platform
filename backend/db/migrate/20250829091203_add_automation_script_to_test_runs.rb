class AddAutomationScriptToTestRuns < ActiveRecord::Migration[8.0]
  def change
    add_reference :test_runs, :automation_script, null: true, foreign_key: true
  end
end
