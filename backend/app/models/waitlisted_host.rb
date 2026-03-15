# frozen_string_literal: true

class WaitlistedHost < ApplicationRecord
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
