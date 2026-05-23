module Types
  # Serializes Ruby float arrays to Postgres pgvector text format, e.g. [1.0,2.0,3.0].
  class Vector < ActiveRecord::Type::Value
    attr_reader :limit

    def initialize(limit: nil)
      @limit = limit
    end

    def type
      :vector
    end

    def serialize(value)
      if value.is_a?(Array)
        value = "[#{value.map(&:to_f).join(",")}]"
      end
      super(value)
    end

    private

    def cast_value(value)
      case value
      when String
        value[1..-1].split(",").map(&:to_f)
      when Array
        value.map(&:to_f)
      else
        value
      end
    end
  end
end
