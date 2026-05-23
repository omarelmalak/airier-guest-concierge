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
import { toast } from "sonner";

const ExactAnswersTab = ({ propertyId }: { propertyId: string }) => {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
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
            toast.success("Exact answer removed successfully");
            setNewQuestion("");
            setNewAnswer("");
            setShowAddForm(false);
        }
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setNewQuestion("");
        setNewAnswer("");
    };

    const removeExactAnswer = async (id: string) => {
        await deleteExactAnswer(propertyId, id);
        queryClient.invalidateQueries({ queryKey: ['exact-answers', propertyId] });
        toast.success("Exact answer removed successfully");
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
        if (!editingId || !editQuestion.trim() || !editAnswer.trim()) {
            toast.error("Question and answer are both required.");
            return;
        }
        try {
            await updateExactAnswer(propertyId, editingId, {
                question: editQuestion.trim(),
                answer: editAnswer.trim(),
            });
            queryClient.invalidateQueries({ queryKey: ['exact-answers', propertyId] });
            toast.success("Exact answer updated.");
            cancelEditing();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update exact answer.");
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
            {/* Add Exact Answer Button / Form (same pattern as Guests tab) */}
            {!showAddForm ? (
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Exact Answer
                </Button>
            ) : (
                <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Add New Exact Answer</h3>
                        <button
                            onClick={closeAddForm}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        When guests ask a matching question, the AI will respond with this exact answer.
                    </p>
                    <div className="space-y-4 mb-4">
                        <div>
                            <Label htmlFor="new-question">Question *</Label>
                            <Input
                                id="new-question"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="e.g., What's the Wi-Fi password?"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-answer">Answer *</Label>
                            <Textarea
                                id="new-answer"
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="The exact response the AI will give..."
                                className="min-h-[80px] mt-1.5 resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={closeAddForm}>
                            Cancel
                        </Button>
                        <Button
                            onClick={addExactAnswer}
                            disabled={!newQuestion || !newAnswer}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Answer
                        </Button>
                    </div>
                </div>
            )}

            {/* Saved Answers List (same card pattern as Guests "Enrolled Guests") */}
            <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold">Exact Answers</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {exactAnswers?.length ?? 0} saved {exactAnswers?.length === 1 ? 'answer' : 'answers'}
                    </p>
                </div>

                {exactAnswers && exactAnswers.length > 0 ? (
                    <div className="p-6 space-y-4">
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
                ) : (
                    <div className="text-center py-12 text-muted-foreground px-6">
                        <p>No exact answers configured yet.</p>
                        <p className="text-sm mt-1">Click &quot;Add Exact Answer&quot; above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExactAnswersTab;