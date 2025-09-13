class AddTestDataToTestCases < ActiveRecord::Migration[8.0]
  def change
    add_column :test_cases, :test_data, :text
  end
end
