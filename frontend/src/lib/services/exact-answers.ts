import { api } from "../api";
import { ExactAnswer } from "../static-data/client-types";
import { ExactAnswerInfo } from "../static-data/request-types";
import { CreateExactAnswerResponse } from "../static-data/response-types";

export const createExactAnswer = async (
    propertyId: string,
    exactAnswer: Pick<ExactAnswerInfo, "question" | "answer">
): Promise<CreateExactAnswerResponse> => {
    return api.post<CreateExactAnswerResponse>(`/properties/${propertyId}/exact_answers`, {
        exact_answer: {
            question: exactAnswer.question,
            answer: exactAnswer.answer,
        },
    });
};

export const getExactAnswers = async (propertyId: string): Promise<ExactAnswer[]> => {
    return api.get<ExactAnswer[]>(`/properties/${propertyId}/exact_answers`);
};

export const updateExactAnswer = async (
    propertyId: string,
    exactAnswerId: string,
    payload: Pick<ExactAnswerInfo, "question" | "answer">
): Promise<CreateExactAnswerResponse> => {
    return api.patch<CreateExactAnswerResponse>(`/properties/${propertyId}/exact_answers/${exactAnswerId}`, {
        exact_answer: { question: payload.question, answer: payload.answer },
    });
};

export const deleteExactAnswer = async (propertyId: string, exactAnswerId: string): Promise<void> => {
    return api.delete<void>(`/properties/${propertyId}/exact_answers/${exactAnswerId}`);
};