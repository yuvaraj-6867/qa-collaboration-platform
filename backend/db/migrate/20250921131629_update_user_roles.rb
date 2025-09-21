class UpdateUserRoles < ActiveRecord::Migration[7.1]
  def up
    # Map old roles to new roles
    role_mapping = {
      'qa_engineer' => 'tester',
      'qa_manager' => 'manager',
      'compliance_officer' => 'manager',
      'developer' => 'developer',
      'admin' => 'admin'
    }
    
    role_mapping.each do |old_role, new_role|
      User.where(role: old_role).update_all(role: new_role)
    end
  end
  
  def down
    # Reverse mapping for rollback
    role_mapping = {
      'tester' => 'qa_engineer',
      'manager' => 'qa_manager',
      'developer' => 'developer',
      'admin' => 'admin'
    }
    
    role_mapping.each do |new_role, old_role|
      User.where(role: new_role).update_all(role: old_role)
    end
  end
end
