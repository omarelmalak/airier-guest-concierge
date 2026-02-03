module Api
    module V1
        class KnowledgeCategoryFeaturesController < ApplicationController
            # POST /api/v1/knowledge_category_features (CREATE KNOWLEDGE CATEGORY FEATURE)
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)

                property = Property.where(host_id: host.id).find_by!(id: post_knowledge_category_feature_params[:property_id])
                
                knowledge_category = KnowledgeCategory.find_by!(
                    id: post_knowledge_category_feature_params[:knowledge_category_id]
                )

                feature = Feature.find_by!(
                    id: post_knowledge_category_feature_params[:feature_id]
                )

                property_knowledge_category = PropertyKnowledgeCategory.find_or_create_by!(
                    property: property,
                    knowledge_category: knowledge_category,
                    feature: feature,
                    description: post_knowledge_category_feature_params[:description]
                )

                render json: format_post_knowledge_category_feature_response(knowledge_category_feature)
            end

            private

            def post_knowledge_category_feature_params
                params.require(:knowledge_category_feature).permit(:property_id, :knowledge_category_id, :feature_id, :description)
            end

            def format_post_knowledge_category_feature_response(knowledge_category_feature)
                { id: knowledge_category_feature.id, 
                knowledge_category_id: knowledge_category_feature.knowledge_category_id, 
                feature_id: knowledge_category_feature.feature_id, 
                description: knowledge_category_feature.description }
            end
        end
    end
end