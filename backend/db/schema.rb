# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_08_180000) do
  create_schema "extensions"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.uuid-ossp"
  enable_extension "graphql.pg_graphql"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vault.supabase_vault"

  create_table "public.auto_messages", primary_key: "text_id", id: :uuid, default: nil, force: :cascade do |t|
    t.boolean "enabled", default: true, null: false
    t.boolean "sent", default: false, null: false
    t.text "type", null: false
    t.check_constraint "type = ANY (ARRAY['response'::text, 'checkin'::text, 'checkout'::text])", name: "auto_messages_type_check"
  end

  create_table "public.conversations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }, null: false
  end

  create_table "public.escalations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "conversation_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "summary"
  end

  create_table "public.exact_answers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "answer", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.uuid "property_id", null: false
    t.text "question", null: false

    t.unique_constraint ["property_id", "question"], name: "exact_answers_property_question_unique"
  end

  create_table "public.features", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "name", null: false
  end

  create_table "public.guests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "email"
    t.text "first_name", null: false
    t.text "last_name"
    t.text "phone", null: false
  end

  create_table "public.hosts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "auth_user_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "email", null: false
    t.text "first_name"
    t.text "last_name"
    t.text "phone"

    t.unique_constraint ["auth_user_id"], name: "hosts_auth_user_id_key"
  end

  create_table "public.knowledge_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "name", null: false

    t.unique_constraint ["name"], name: "knowledge_categories_name_key"
  end

  create_table "public.knowledge_category_features", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "description"
    t.uuid "feature_id", null: false
    t.uuid "knowledge_category_id", null: false
    t.uuid "property_id", null: false

    t.unique_constraint ["knowledge_category_id", "feature_id"], name: "kcf_category_feature_unique"
  end

  create_table "public.properties", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "address"
    t.integer "bathrooms"
    t.integer "bedrooms"
    t.text "checkin_msg"
    t.float "checkin_reminder_hours", limit: 24
    t.time "checkin_time"
    t.text "checkout_msg"
    t.float "checkout_reminder_hours", limit: 24
    t.time "checkout_time"
    t.timestamptz "created_at", default: -> { "now()" }
    t.uuid "host_id", null: false
    t.text "name", null: false
    t.text "ownership_level"
    t.text "photo"
    t.text "property_type"
  end

  create_table "public.property_knowledge_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "description"
    t.uuid "knowledge_category_id", null: false
    t.uuid "property_id", null: false

    t.unique_constraint ["property_id", "knowledge_category_id"], name: "pkc_property_category_unique"
  end

  create_table "public.reservations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "check_in", null: false
    t.date "check_out", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.uuid "guest_id", null: false
    t.uuid "property_id", null: false
  end

  create_table "public.subscriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.timestamptz "cancelled_at"
    t.timestamptz "created_at", default: -> { "now()" }
    t.timestamptz "current_period_end"
    t.timestamptz "current_period_start", null: false
    t.uuid "property_id", null: false
    t.text "stripe_customer_id", null: false
    t.text "stripe_subscription_id", null: false
    t.index ["property_id"], name: "one_active_subscription_per_property", unique: true, where: "(cancelled_at IS NULL)"
    t.unique_constraint ["stripe_subscription_id"], name: "subscriptions_stripe_subscription_id_key"
  end

  create_table "public.texts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.uuid "conversation_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }, null: false
    t.text "role", null: false
    t.check_constraint "role = ANY (ARRAY['user'::text, 'concierge'::text])", name: "texts_role_check"
  end

  add_foreign_key "public.auto_messages", "public.texts", name: "auto_messages_text_id_fkey", on_delete: :cascade
  add_foreign_key "public.escalations", "public.conversations", name: "escalations_conversation_fk", on_delete: :cascade
  add_foreign_key "public.exact_answers", "public.properties", name: "exactanswers_properties_fk", on_delete: :cascade
  add_foreign_key "public.hosts", "public.auth.users", column: "auth_user_id", name: "hosts_auth_user_fk", on_delete: :cascade
  add_foreign_key "public.knowledge_category_features", "public.features", name: "kcf_feature_fk", on_delete: :cascade
  add_foreign_key "public.knowledge_category_features", "public.knowledge_categories", name: "kcf_category_fk", on_delete: :cascade
  add_foreign_key "public.knowledge_category_features", "public.properties", name: "knowledge_category_features_property_id_fkey", on_delete: :cascade
  add_foreign_key "public.properties", "public.hosts", name: "properties_host_fk", on_delete: :cascade
  add_foreign_key "public.property_knowledge_categories", "public.knowledge_categories", name: "pkc_category_fk", on_delete: :cascade
  add_foreign_key "public.property_knowledge_categories", "public.properties", name: "pkc_property_fk", on_delete: :cascade
  add_foreign_key "public.reservations", "public.guests", name: "reservations_guest_fk", on_delete: :cascade
  add_foreign_key "public.reservations", "public.properties", name: "reservations_property_fk", on_delete: :cascade
  add_foreign_key "public.subscriptions", "public.properties", name: "subscriptions_property_fk", on_delete: :cascade
  add_foreign_key "public.texts", "public.conversations", name: "texts_conversation_id_fkey", on_delete: :cascade

end
