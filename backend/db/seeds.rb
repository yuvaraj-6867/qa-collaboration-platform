puts "🔄 RESETTING DATABASE..."

# Complete database reset
TestRun.destroy_all if ActiveRecord::Base.connection.table_exists?(:test_runs)
TestCase.destroy_all if ActiveRecord::Base.connection.table_exists?(:test_cases)
Ticket.destroy_all if ActiveRecord::Base.connection.table_exists?(:tickets)
Label.destroy_all if ActiveRecord::Base.connection.table_exists?(:labels)
Folder.destroy_all if ActiveRecord::Base.connection.table_exists?(:folders)
UserSetting.destroy_all if ActiveRecord::Base.connection.table_exists?(:user_settings)
User.destroy_all if ActiveRecord::Base.connection.table_exists?(:users)

# Reset auto-increment counters
ActiveRecord::Base.connection.reset_pk_sequence!('users') if ActiveRecord::Base.connection.table_exists?(:users)
ActiveRecord::Base.connection.reset_pk_sequence!('test_cases') if ActiveRecord::Base.connection.table_exists?(:test_cases)
ActiveRecord::Base.connection.reset_pk_sequence!('tickets') if ActiveRecord::Base.connection.table_exists?(:tickets)

puts "Creating sample users..."

admin = User.create!(
  email: 'admin@test.com',
  password: 'password123',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  status: 'active'
)

qa_manager = User.create!(
  email: 'qa_manager@test.com',
  password: 'password123',
  first_name: 'QA',
  last_name: 'Manager',
  role: 'qa_manager',
  status: 'active'
)

qa_engineer = User.create!(
  email: 'qa_engineer@test.com',
  password: 'password123',
  first_name: 'QA',
  last_name: 'Engineer',
  role: 'qa_engineer',
  status: 'active'
)

developer = User.create!(
  email: 'developer@test.com',
  password: 'password123',
  first_name: 'Dev',
  last_name: 'User',
  role: 'developer',
  status: 'active'
)

# Compliance Officer
compliance_officer = User.create!(
  email: 'compliance@test.com',
  password: 'password123',
  first_name: 'Sarah',
  last_name: 'Officer',
  role: 'compliance_officer',
  status: 'active',
  phone: '+1 (555) 567-8901',
  location: 'Boston, MA',
  joined_date: Date.current
)

puts "Created users:"
puts "Admin: admin@test.com"
puts "QA Manager: qa_manager@test.com"
puts "QA Engineer: qa_engineer@test.com"
puts "Developer: developer@test.com"
puts "Password for all: password123"
puts "Total users: #{User.count}"
