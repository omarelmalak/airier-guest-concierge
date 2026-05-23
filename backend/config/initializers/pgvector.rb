# Teach ActiveRecord how to read/write pgvector columns (Rails 8 does not fully handle this yet).
ActiveSupport.on_load(:active_record_postgresqladapter) do
  adapter = ActiveRecord::ConnectionAdapters::PostgreSQLAdapter

  adapter::NATIVE_DATABASE_TYPES[:vector] = { name: "vector" }

  module PgvectorTypes
    def initialize_type_map(m)
      super
      m.register_type "vector" do |_, _, sql_type|
        limit = extract_limit(sql_type)
        Types::Vector.new(limit: limit)
      end
    end
  end

  adapter.singleton_class.prepend(PgvectorTypes)
end
