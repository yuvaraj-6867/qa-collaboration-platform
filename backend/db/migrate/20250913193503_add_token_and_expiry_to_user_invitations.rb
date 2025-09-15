class AddTokenAndExpiryToUserInvitations < ActiveRecord::Migration[8.0]
  def change
    add_column :user_invitations, :token, :string
    add_column :user_invitations, :expires_at, :datetime
  end
end
