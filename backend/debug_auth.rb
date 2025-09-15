#!/usr/bin/env ruby

# Quick authentication debugging script
puts "=== QA Platform Authentication Debug ==="
puts

# Check if we're in the Rails app directory
unless File.exist?('config/application.rb')
  puts "❌ Not in Rails app directory. Please run from backend folder."
  exit 1
end

# Load Rails environment
require_relative 'config/environment'

puts "✅ Rails environment loaded"
puts

# Check users
user_count = User.count
puts "👥 Users in database: #{user_count}"

if user_count > 0
  puts "\n📋 User list:"
  User.limit(5).each do |user|
    puts "  - ID: #{user.id}, Email: #{user.email}, Role: #{user.role}"
  end
  
  # Generate test token for first user
  first_user = User.first
  token = JsonWebToken.encode(user_id: first_user.id)
  puts "\n🔑 Test token for #{first_user.email}:"
  puts token
  puts
  puts "💡 You can use this token in your frontend by running:"
  puts "   localStorage.setItem('token', '#{token}')"
  puts "   localStorage.setItem('user', '#{first_user.to_json(only: [:id, :email, :first_name, :last_name, :role])}')"
else
  puts "\n⚠️  No users found. Creating a test user..."
  
  user = User.create!(
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    role: 'qa_manager',
    status: 'active'
  )
  
  token = JsonWebToken.encode(user_id: user.id)
  puts "✅ Test user created: #{user.email}"
  puts "🔑 Token: #{token}"
end

puts "\n🔧 Debug endpoints available:"
puts "  GET /api/v1/auth/debug/status - Check auth status"
puts "  GET /api/v1/auth/debug/test_token - Get test token"
puts
puts "🌐 Test these URLs:"
puts "  curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:3001/api/v1/auth/debug/status"
puts "  curl http://localhost:3001/api/v1/auth/debug/test_token"