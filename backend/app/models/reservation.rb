class Reservation < ApplicationRecord
  belongs_to :property
  belongs_to :guest
  has_many :auto_messages, dependent: :destroy
end
