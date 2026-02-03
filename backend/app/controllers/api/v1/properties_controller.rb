module Api
  module V1
    class PropertiesController < ApplicationController

            # POST /api/v1/properties (CREATE PROPERTY)
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)

                property = Property.create!(
                    post_property_params.merge(host_id: host.id)
                )

                render json: format_property(property), status: :created
            end

            private

            def post_property_params
                params.require(:property).permit(
                    :name,
                    :property_type,
                    :bedrooms,
                    :bathrooms,
                    :address,
                    :photo,
                    :ownership_level,
                    :checkin_msg,
                    :checkout_msg
                  )
            end
            
            def format_property(property)
                { id: property.id, 
                host_id: property.host_id,
                name: property.name, 
                property_type: property.property_type, 
                bedrooms: property.bedrooms, 
                bathrooms: property.bathrooms, 
                address: property.address,
                photo: property.photo,
                ownership_level: property.ownership_level,
                checkin_msg: property.checkin_msg, 
                checkout_msg: property.checkout_msg }
        end
    end
  end
end