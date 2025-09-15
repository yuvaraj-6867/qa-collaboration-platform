class ResetAllData < ActiveRecord::Migration[8.0]
  def up
    # Reset all tables (SQLite3 compatible)
    %w[users test_cases tickets test_runs documents automation_scripts].each do |table|
      execute "DELETE FROM #{table}"
      execute "DELETE FROM sqlite_sequence WHERE name='#{table}'" if ActiveRecord::Base.connection.adapter_name == 'SQLite'
    end
    
    # Add sample data
    User.create!(
      email: 'admin@test.com',
      password: 'password123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active'
    )
  end

  def down
    # Cannot rollback data deletion
  end
end