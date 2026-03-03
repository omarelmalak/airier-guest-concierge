module Api
    module V1
        class ExactAnswersController < ApplicationController

            # GET /api/v1/properties/:property_id/exact_answers (list all for property)
            def index
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
                exact_answers = ExactAnswer.where(property_id: property.id)
                render json: exact_answers.map { |ea| format_exact_answer(ea) }
            end

            # POST /api/v1/properties/:property_id/exact_answers
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
                exact_answer = ExactAnswer.create!(
                    property_id: property.id,
                    **post_exact_answer_params
                )
                render json: format_exact_answer(exact_answer)
            end

            # PATCH /api/v1/properties/:property_id/exact_answers/:id
            def update
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
                exact_answer = ExactAnswer.where(property_id: property.id).find_by!(id: params[:id])
                exact_answer.update!(**patch_exact_answer_params)
                render json: format_exact_answer(exact_answer)
            end

            # DELETE /api/v1/properties/:property_id/exact_answers/:id
            def destroy
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
                exact_answer = ExactAnswer.where(property_id: property.id).find_by!(id: params[:id])
                exact_answer.destroy!
                render json: { message: "Exact answer deleted successfully" }
            end

            private

            def post_exact_answer_params
                params.require(:exact_answer).permit(:question, :answer).to_h.symbolize_keys
            end

            def patch_exact_answer_params
                params.require(:exact_answer).permit(:question, :answer).to_h.symbolize_keys
            end

            def format_exact_answer(exact_answer)
                { id: exact_answer.id, property_id: exact_answer.property_id, question: exact_answer.question, answer: exact_answer.answer }
            end
        end
    end
end