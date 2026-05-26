# frozen_string_literal: true

require "net/http"
require "json"

class GeminiJsonGenerator
  DEFAULT_MODEL = ENV.fetch("GEMINI_MODEL", "gemini-flash-latest")

  class Error < StandardError; end

  def self.generate(system_instruction:, user_content:)
    api_key = ENV["GEMINI_API_KEY"].to_s.strip
    raise Error, "GEMINI_API_KEY is required for Airbnb import" if api_key.blank?

    uri = URI(
      "https://generativelanguage.googleapis.com/v1beta/models/#{DEFAULT_MODEL}:generateContent?key=#{api_key}"
    )
    body = {
      systemInstruction: { parts: [{ text: system_instruction }] },
      contents: [{ role: "user", parts: [{ text: user_content }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    }

    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, read_timeout: 120, open_timeout: 15) do |http|
      req = Net::HTTP::Post.new(uri)
      req["Content-Type"] = "application/json"
      req.body = body.to_json
      http.request(req)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise Error, "Gemini request failed (#{response.code}): #{response.body.to_s.truncate(500)}"
    end

    data = JSON.parse(response.body)
    text = data.dig("candidates", 0, "content", "parts", 0, "text").to_s.strip
    raise Error, "Gemini returned empty content" if text.blank?

    JSON.parse(text)
  rescue JSON::ParserError => e
    raise Error, "Gemini returned invalid JSON: #{e.message}"
  rescue SocketError, Timeout::Error, Errno::ECONNREFUSED => e
    raise Error, e.message
  end
end
