import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ExactAnswer } from "@/lib/static-data/client-types";

interface Step7ExactAnswersProps {
  exactAnswers: ExactAnswer[];
  addExactAnswer: () => void;
  removeExactAnswer: (id: string) => void;
  updateExactAnswer: (id: string, field: "question" | "answer", value: string) => void;
}

export const Step7ExactAnswers = ({
  exactAnswers,
  addExactAnswer,
  removeExactAnswer,
  updateExactAnswer,
}: Step7ExactAnswersProps) => {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        When guests ask questions matching the ones below, the AI will respond with the exact answer you provide.
      </p>
      {exactAnswers.map((ea, index) => (
        <div
          key={ea.id}
          className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Q&A #{index + 1}
            </span>
            {exactAnswers.length > 1 && (
              <button
                onClick={() => removeExactAnswer(ea.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <Label>Question</Label>
            <Input
              placeholder="e.g., What's the Wi-Fi password?"
              value={ea.question}
              onChange={(e) => updateExactAnswer(ea.id, "question", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              placeholder="The exact response the AI will give..."
              value={ea.answer}
              onChange={(e) => updateExactAnswer(ea.id, "answer", e.target.value)}
              className="mt-1.5 min-h-[80px] resize-none"
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addExactAnswer}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Q&A
      </Button>
    </div>
  );
};
