class AutoMessage < ApplicationRecord
  belongs_to :text, optional: true
  belongs_to :reservation
end
