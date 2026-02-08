module Api
    module V1
        class ExactAnswersController < ApplicationController

            # POST /api/v1/exact_answers (CREATE EXACT ANSWER)
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)

                property = Property.where(host_id: host.id).find_by!(id: post_exact_answer_params[:property_id])

                exact_answer = ExactAnswer.new(
                    post_exact_answer_params
                )

                render json: format_create_exact_answer_response(exact_answer)
            end

            private

            def post_exact_answer_params
                params.require(:exact_answer).permit(:property_id, :question, :answer)
            end

            def format_create_exact_answer_response(exact_answer)
                { id: exact_answer.id, property_id: exact_answer.property_id, question: exact_answer.question, answer: exact_answer.answer }
            end
        end
    end
end