User.delete_all if ActiveRecord::Base.connection.table_exists?(:users)

# QA Engineer
User.create!(
  email: 'yuvaraj@test.com',
  password: 'password123',
  first_name: 'Yuva',
  last_name: 'Raj',
  role: 'qa_engineer',
  status: 'active',
  phone: '9025986867',
  location: 'chennai',
  joined_date: Date.current
)
# QA Manager
User.create!(
  email: 'qa.manager@test.com',
  password: 'password123',
  first_name: 'Jane',
  last_name: 'Manager',
  role: 'qa_manager',
  status: 'active',
  phone: '+1 (555) 345-6789',
  location: 'San Francisco, CA',
  joined_date: Date.current
)
# Developer
User.create!(
  email: 'developer@test.com',
  password: 'password123',
  first_name: 'Mike',
  last_name: 'Developer',
  role: 'developer',
  status: 'active',
  phone: '+1 (555) 456-7890',
  location: 'Austin, TX',
  joined_date: Date.current
)
# Admin
User.create!(
  email: 'admin@test.com',
  password: 'password123',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  status: 'active',
  phone: '+1 (555) 678-9012',
  location: 'Seattle, WA',
  joined_date: Date.current
)

puts "Created users:"
puts "Total users: #{User.count}"

# database:
# rails db:drop
# rails db:create
# rails db:migrate
# rails db:seed


# Role-Based Navigation Access:
# Admin
# ✅ All pages displayed (complete access)

# Dashboard, Test Cases, Automation, Tickets, Projects, Documents, Analytics, Users

# QA Manager & QA Engineer
# ✅ Most pages except Users tab

# Dashboard, Test Cases, Automation, Tickets, Projects, Documents, Analytics

# ❌ No Users tab (admin-only)

# Developer
# ✅ Only Tickets tab (limited access)
# Dashboard, Tickets