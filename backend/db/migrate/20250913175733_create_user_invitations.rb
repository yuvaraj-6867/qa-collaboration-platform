class CreateUserInvitations < ActiveRecord::Migration[8.0]
  def change
    create_table :user_invitations do |t|
      t.string :email
      t.string :status, default: 'pending'
      t.references :invited_by, null: false, foreign_key: true
      t.string :role

      t.timestamps
    end
  end
end
