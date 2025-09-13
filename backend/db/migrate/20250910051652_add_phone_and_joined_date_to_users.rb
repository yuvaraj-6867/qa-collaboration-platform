class AddPhoneAndJoinedDateToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :phone, :string
    add_column :users, :joined_date, :date
  end
end
