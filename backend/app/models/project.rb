class Project < ApplicationRecord
  validates :name, presence: true
  validates :status, inclusion: { in: %w[active inactive] }
end
