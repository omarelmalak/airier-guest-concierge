import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { ExactAnswer } from "@/lib/static-data/client-types";
import { createExactAnswer, deleteExactAnswer, getExactAnswers, updateExactAnswer } from "@/lib/services/exact-answers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

const ExactAnswersTab = ({ propertyId }: { propertyId: string }) => {
    const queryClient = useQueryClient();
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");

    const { data: exactAnswers, isLoading, error } = useQuery({
        queryKey: ['exact-answers', propertyId],
        queryFn: () => getExactAnswers(propertyId),
    });

    const addExactAnswer = async () => {
        if (newQuestion && newAnswer) {
            await createExactAnswer(propertyId, { question: newQuestion, answer: newAnswer });
            queryClient.invalidateQueries({ queryKey: ['exact-answers', propertyId] });
            setNewQuestion("");
            setNewAnswer("");
        }
    };

    const removeExactAnswer = async (id: string) => {
        await deleteExactAnswer(propertyId, id);
        queryClient.invalidateQueries({ queryKey: ['exact-answers', propertyId] });
    };

    const startEditing = (ea: ExactAnswer) => {
        setEditingId(ea.id);
        setEditQuestion(ea.question);
        setEditAnswer(ea.answer);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditQuestion("");
        setEditAnswer("");
    };

    const saveEdit = async () => {
        if (editingId && (editQuestion.trim() || editAnswer.trim())) {
            await updateExactAnswer(propertyId, editingId, { question: editQuestion.trim(), answer: editAnswer.trim() });
            queryClient.invalidateQueries({ queryKey: ['exact-answers', propertyId] });
            cancelEditing();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">Failed to load exact answers.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Existing Answers */}
            {exactAnswers && exactAnswers.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                    <h3 className="text-lg font-semibold mb-4">Saved Answers ({exactAnswers.length})</h3>
                    <div className="space-y-4">
                        {exactAnswers.map((ea) => (
                            <div
                                key={ea.id}
                                className="p-4 bg-secondary rounded-xl flex items-start justify-between gap-4"
                            >
                                {editingId === ea.id ? (
                                    <>
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Question</Label>
                                                <Input
                                                    value={editQuestion}
                                                    onChange={(e) => setEditQuestion(e.target.value)}
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Answer</Label>
                                                <Textarea
                                                    value={editAnswer}
                                                    onChange={(e) => setEditAnswer(e.target.value)}
                                                    className="min-h-[80px] bg-background resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={saveEdit}
                                                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                title="Save"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground mb-1">Q: {ea.question}</p>
                                            <p className="text-sm text-muted-foreground">A: {ea.answer}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => startEditing(ea)}
                                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeExactAnswer(ea.id)}
                                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!exactAnswers || exactAnswers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No exact answers configured yet.</p>
                    <p className="text-sm mt-1">Add your first Q&A pair above.</p>
                </div>
            )}

            {/* Add New */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <h3 className="text-lg font-semibold mb-4">Add Exact Answer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    When guests ask questions matching the ones below, the AI will respond with the exact answer you provide.
                </p>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Question</Label>
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="e.g., What's the Wi-Fi password?"
                            className="bg-secondary border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Answer</Label>
                        <Textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="The exact response the AI will give..."
                            className="min-h-[80px] bg-secondary border-0 resize-none"
                        />
                    </div>
                    <Button
                        onClick={addExactAnswer}
                        disabled={!newQuestion || !newAnswer}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Answer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExactAnswersTab;