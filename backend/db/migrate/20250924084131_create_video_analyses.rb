class CreateVideoAnalyses < ActiveRecord::Migration[7.1]
  def change
    create_table :video_analyses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :filename
      t.string :status
      t.json :analysis_results

      t.timestamps
    end
  end
end
