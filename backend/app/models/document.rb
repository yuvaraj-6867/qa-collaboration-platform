class Document < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  validates :file_path, presence: true
  validates :content_type, presence: true
  validates :version, presence: true

  belongs_to :folder, optional: true
  belongs_to :user
  has_one_attached :file

  scope :by_folder, ->(folder_id) { where(folder_id: folder_id) }
  scope :by_tags, ->(tag_list) { where("tags LIKE ?", "%#{tag_list.join('%')}%") }
  scope :recent, -> { order(created_at: :desc) }

  before_save :set_file_metadata, if: -> { file.attached? }
  before_save :increment_version, if: -> { file.attached? && persisted? }

  def tag_list
    tags&.split(',')&.map(&:strip) || []
  end

  def tag_list=(new_tags)
    self.tags = Array(new_tags).join(', ')
  end

  def file_size_human
    return 'N/A' unless file_size

    units = %w[B KB MB GB TB]
    size = file_size.to_f
    unit_index = 0

    while size >= 1024 && unit_index < units.length - 1
      size /= 1024
      unit_index += 1
    end

    "#{size.round(2)} #{units[unit_index]}"
  end

  private

  def set_file_metadata
    if file.attached?
      self.file_size = file.blob.byte_size
      self.content_type = file.blob.content_type
      self.file_path = file.blob.key
    end
  end

  def increment_version
    current_version = version.to_f
    self.version = (current_version + 0.1).round(1).to_s
  end
end