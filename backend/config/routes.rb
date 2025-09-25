Rails.application.routes.draw do
  get '/favicon.ico', to: proc { [204, {}, []] }
  match '/firebase*', to: proc { [204, {}, []] }, via: :all
  
  # WebSocket cable
  mount ActionCable.server => '/cable'
  
  root 'home#index'
  namespace :api do
    namespace :v1 do
      resources :test_cases do
        member do
          post :clone
          get :history
          patch :update_status
        end
        collection do
          post :bulk_import
          get :export
        end
        resources :test_runs, only: [:index, :create]
        resources :comments, only: [:index, :create, :update, :destroy]
        resources :test_case_attachments, only: [:index, :create, :destroy]
      end
      
      resources :tickets do
        collection do
          get :form_data
        end
        resources :comments, only: [:index, :create, :update, :destroy]
      end
      
      resources :test_runs, only: [:index, :show, :update]
      resources :folders, only: [:index, :show, :create, :update, :destroy]
      resources :users, only: [:index, :show, :create, :update] do
        collection do
          get :current
        end
      end
      resources :user_invitations, only: [:create]
      resources :projects
      
      resources :automation_scripts do
        member do
          post :execute
        end
      end
      
      resources :documents do
        member do
          get :download
        end
      end
      
      resources :labels
      
      resources :video_analyses, only: [:create] do
        member do
          post :analyze
          get :results
        end
      end
      post 'video_analyses/upload', to: 'video_analyses#upload'
      
      resources :notifications, only: [:index] do
        collection do
          get :count
        end
        member do
          patch :read
        end
      end
      
      # Settings
      get 'settings', to: 'settings#show'
      patch 'settings', to: 'settings#update'
      
      # Dashboard and analytics
      get 'dashboard/metrics', to: 'dashboard#metrics'
      get 'dashboard/recent_activity', to: 'dashboard#recent_activity'
      get 'dashboard/trends', to: 'dashboard#trends'
      get 'dashboard/user_activity', to: 'dashboard#user_activity'
      
      # Admin
      post 'admin/reset_database', to: 'admin#reset_database'
      
      # Authentication
      post 'auth/login', to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      delete 'auth/logout', to: 'authentication#logout'
      patch 'auth/change_password', to: 'authentication#change_password'
      get 'auth/dev_token', to: 'authentication#dev_token' if Rails.env.development?
      
      # Auth debugging (development only)
      if Rails.env.development?
        get 'auth/debug/status', to: 'auth_debug#status'
        get 'auth/debug/test_token', to: 'auth_debug#test_token'
      end
      
      # Invitations
      post 'invitations/send', to: 'invitations#send_invitation'
      
      # Calendar Events
      resources :calendar_events
    end
  end

  # Simple routes for testing
  get '/testcases', to: redirect('/api/v1/test_cases')
  get '/login', to: redirect('/api/v1/auth/login')

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
