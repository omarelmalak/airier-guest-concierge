Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      # Simple hello endpoint
      get "hello", to: "hello#index"
      
      # Guests endpoints
      resources :guests, only: [:index, :show, :create]
      
      # Host endpoints
      resource :hosts, only: [] do
        patch :profile, to: "hosts#complete_profile"
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
