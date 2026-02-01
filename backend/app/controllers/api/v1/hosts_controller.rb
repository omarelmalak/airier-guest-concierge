module Api
  module V1
    class HostsController < ApplicationController

        # POST /api/v1/hosts/profile (SIGNUP)
        def complete_profile
            host = Host.find_by!(auth_user_id: @auth_user_id)
        
            host.update!(host_params)
        
            render json: format_host(host)
        end
  
        private
  
        def host_params
          params.require(:host).permit(:first_name, :last_name, :phone)
        end
  
        def format_host(host)
          {
            id: host.id,
            first_name: host.first_name,
            last_name: host.last_name,
            email: host.email,
            phone: host.phone,
            created_at: host.created_at,
          }
        end
      end
    end
  end
  