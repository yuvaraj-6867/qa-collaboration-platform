class ResetAllData < ActiveRecord::Migration[8.0]
  def up
    # Reset all tables
    execute "TRUNCATE TABLE users, test_cases, tickets, test_runs, documents, automation_scripts RESTART IDENTITY CASCADE"
    
    # Add sample data
    User.create!(
      email: 'admin@test.com',
      password: 'password',
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