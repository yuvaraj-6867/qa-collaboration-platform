class TestCaseAttachment < ApplicationRecord
  belongs_to :test_case
  has_one_attached :file

  validates :filename, presence: true
  validates :content_type, presence: true
  validates :attachment_type, inclusion: { in: %w[image video] }

  scope :images, -> { where(attachment_type: 'image') }
  scope :videos, -> { where(attachment_type: 'video') }

  before_save :set_file_metadata, if: -> { file.attached? }

  def file_url
    Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true) if file.attached?
  end

  private

  def set_file_metadata
    if file.attached?
      self.filename = file.blob.filename.to_s
      self.content_type = file.blob.content_type
      self.file_size = file.blob.byte_size
      self.attachment_type = content_type.start_with?('image/') ? 'image' : 'video'
    end
  end
end