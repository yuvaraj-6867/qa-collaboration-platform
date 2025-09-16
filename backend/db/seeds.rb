puts "Creating sample users..."

User.delete_all if ActiveRecord::Base.connection.table_exists?(:users)

admin = User.create!(
  email: 'yuvaraj6867@gmail.com',
  password: 'yuva123',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  status: 'active',
  phone: '+91 9025986867',
  location: 'chennai',
  joined_date: Date.current
)

puts "Created users:"
puts "Admin: yuvaraj6867@gmail.com"
puts "Password: yuva123"
puts "Total users: #{User.count}"

