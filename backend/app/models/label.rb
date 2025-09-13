class Label < ApplicationRecord
  validates :name, presence: true, uniqueness: true, length: { maximum: 50 }
  validates :color, presence: true, format: { with: /\A#[0-9A-Fa-f]{6}\z/ }

  has_and_belongs_to_many :tickets, join_table: :ticket_labels

  scope :by_name, -> { order(:name) }

  def tickets_count
    tickets.count
  end
end