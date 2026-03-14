# frozen_string_literal: true

class ContactMailer < ApplicationMailer
  default from: ENV.fetch("MAILER_FROM", "noreply@airier.com")
  default to: "omarelmalak28@gmail.com"

  def contact_message(sender_email:, subject:, body:)
    @sender_email = sender_email
    @subject_line = subject
    @body = body

    mail(
      subject: "[Airier Contact] #{subject}",
      reply_to: sender_email
    )
  end
end
