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

ActiveRecord::Schema[8.0].define(version: 2025_09_13_193503) do
  create_table "automation_scripts", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "script_path"
    t.integer "test_case_id", null: false
    t.integer "user_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["test_case_id"], name: "index_automation_scripts_on_test_case_id"
    t.index ["user_id"], name: "index_automation_scripts_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.string "commentable_type", null: false
    t.integer "commentable_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "file_path"
    t.integer "file_size"
    t.string "content_type"
    t.string "version"
    t.integer "folder_id", null: false
    t.integer "user_id", null: false
    t.text "tags"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["folder_id"], name: "index_documents_on_folder_id"
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "folders", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_folders_on_parent_id"
  end

  create_table "labels", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title"
    t.text "message"
    t.string "notification_type"
    t.boolean "read", default: false
    t.string "notifiable_type"
    t.integer "notifiable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "status", default: "active"
    t.string "created_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_projects_on_name", unique: true
    t.index ["status"], name: "index_projects_on_status"
  end

  create_table "test_case_attachments", force: :cascade do |t|
    t.integer "test_case_id", null: false
    t.string "filename", null: false
    t.string "content_type", null: false
    t.integer "file_size", null: false
    t.string "attachment_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["test_case_id", "attachment_type"], name: "idx_on_test_case_id_attachment_type_a382b58a47"
    t.index ["test_case_id"], name: "index_test_case_attachments_on_test_case_id"
  end

  create_table "test_cases", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.text "preconditions"
    t.text "steps"
    t.text "expected_results"
    t.integer "priority"
    t.string "status"
    t.integer "assigned_user_id"
    t.integer "folder_id"
    t.integer "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "test_data"
    t.index ["assigned_user_id"], name: "index_test_cases_on_assigned_user_id"
    t.index ["created_at"], name: "index_test_cases_on_created_at"
    t.index ["created_by_id"], name: "index_test_cases_on_created_by_id"
    t.index ["folder_id"], name: "index_test_cases_on_folder_id"
    t.index ["priority"], name: "index_test_cases_on_priority"
    t.index ["status"], name: "index_test_cases_on_status"
  end

  create_table "test_runs", force: :cascade do |t|
    t.integer "test_case_id", null: false
    t.integer "user_id", null: false
    t.string "status"
    t.integer "execution_time"
    t.text "notes"
    t.text "evidence"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "automation_script_id"
    t.index ["automation_script_id"], name: "index_test_runs_on_automation_script_id"
    t.index ["test_case_id"], name: "index_test_runs_on_test_case_id"
    t.index ["user_id"], name: "index_test_runs_on_user_id"
  end

  create_table "ticket_labels", force: :cascade do |t|
    t.integer "ticket_id", null: false
    t.integer "label_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["label_id"], name: "index_ticket_labels_on_label_id"
    t.index ["ticket_id"], name: "index_ticket_labels_on_ticket_id"
  end

  create_table "tickets", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "status"
    t.string "priority"
    t.string "severity"
    t.integer "assigned_user_id"
    t.integer "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "test_case_id"
    t.integer "test_run_id"
    t.decimal "estimate", precision: 5, scale: 2
    t.index ["assigned_user_id"], name: "index_tickets_on_assigned_user_id"
    t.index ["created_by_id"], name: "index_tickets_on_created_by_id"
    t.index ["test_case_id"], name: "index_tickets_on_test_case_id"
    t.index ["test_run_id"], name: "index_tickets_on_test_run_id"
  end

  create_table "user_invitations", force: :cascade do |t|
    t.string "email"
    t.string "status", default: "pending"
    t.integer "invited_by_id", null: false
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.datetime "expires_at"
    t.index ["invited_by_id"], name: "index_user_invitations_on_invited_by_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "first_name"
    t.string "last_name"
    t.string "role"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location"
    t.string "phone"
    t.date "joined_date"
  end

  add_foreign_key "automation_scripts", "test_cases"
  add_foreign_key "automation_scripts", "users"
  add_foreign_key "comments", "users"
  add_foreign_key "documents", "folders"
  add_foreign_key "documents", "users"
  add_foreign_key "folders", "folders", column: "parent_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "test_case_attachments", "test_cases"
  add_foreign_key "test_cases", "folders"
  add_foreign_key "test_cases", "users", column: "assigned_user_id"
  add_foreign_key "test_cases", "users", column: "created_by_id"
  add_foreign_key "test_runs", "automation_scripts"
  add_foreign_key "test_runs", "test_cases"
  add_foreign_key "test_runs", "users"
  add_foreign_key "ticket_labels", "labels"
  add_foreign_key "ticket_labels", "tickets"
  add_foreign_key "tickets", "test_cases"
  add_foreign_key "tickets", "test_runs"
  add_foreign_key "tickets", "users", column: "assigned_user_id"
  add_foreign_key "tickets", "users", column: "created_by_id"
  add_foreign_key "user_invitations", "users", column: "invited_by_id"
end
