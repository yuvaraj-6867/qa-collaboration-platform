User.delete_all if ActiveRecord::Base.connection.table_exists?(:users)

# QA Engineer
User.create!(
  email: 'yuvaraj@company.com',
  password: 'yuva123',
  first_name: 'Yuva',
  last_name: 'Raj',
  role: 'tester',
  status: 'active',
  phone: '9025986867',
  location: 'Chennai, Tamil Nadu, India',
  joined_date: Date.current
)

# QA Manager
User.create!(
  email: 'qa.manager@company.com',
  password: 'yuva123',
  first_name: 'Yuva',
  last_name: 'Iyer',
  role: 'manager',
  status: 'active',
  phone: '+91 9876543210',
  location: 'Coimbatore, Tamil Nadu, India',
  joined_date: Date.current
)

# Developer
User.create!(
  email: 'developer@company.com',
  password: 'yuva123',
  first_name: 'Yuva',
  last_name: 'Kumar',
  role: 'developer',
  status: 'active',
  phone: '+91 9876543211',
  location: 'Madurai, Tamil Nadu, India',
  joined_date: Date.current
)

# Admin
User.create!(
  email: 'admin@company.com',
  password: 'yuva123',
  first_name: 'Yuva',
  last_name: 'Nair',
  role: 'admin',
  status: 'active',
  phone: '+91 9876543212',
  location: 'Chennai, Tamil Nadu, India',
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