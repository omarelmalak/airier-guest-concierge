module Api
    module V1
        class PropertyKnowledgeCategoriesController < ApplicationController

            # POST /api/v1/property_knowledge_categories (CREATE PROPERTY KNOWLEDGE CATEGORY LINK ENTITY)
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)

                property = Property.where(host_id: host.id).find_by!(id: post_property_knowledge_category_params[:property_id])

                knowledge_category = KnowledgeCategory.find_by!(
                    id: post_property_knowledge_category_params[:knowledge_category_id]
                )

                property_knowledge_category = PropertyKnowledgeCategory.find_or_create_by!(
                    property: property,
                    knowledge_category: knowledge_category
                )

                render json: format_create_property_knowledge_categories_response(property_knowledge_category)
            end

            private

            def post_property_knowledge_category_params
                params.require(:property_knowledge_category).permit(:property_id, :knowledge_category_id, :description)
            end

            def format_create_property_knowledge_categories_response(property_knowledge_category)
                {
                    id: property_knowledge_category.id,
                    property_id: property_knowledge_category.property_id,
                    knowledge_category_id: property_knowledge_category.knowledge_category_id,
                    description: property_knowledge_category.description
                }
            end
        end
    end
end 