module Api
    module V1
        class KnowledgeCategoriesController < ApplicationController

            # POST /api/v1/knowledge_categories (CREATE KNOWLEDGE CATEGORY)
            def create
                knowledge_category = KnowledgeCategory.find_or_create_by!(
                    name: post_knowledge_category_params[:name]
                )

                render json: format_post_knowledge_category_response(knowledge_category)
            end

            private

            def post_knowledge_category_params
                params.require(:knowledge_category).permit(:name)
            end

            def format_post_knowledge_category_response(knowledge_category)
                {
                    id: knowledge_category.id,
                    name: knowledge_category.name,
                }
            end
        end
    end
end
