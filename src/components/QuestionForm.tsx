import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
};

export const QuestionForm = ({ onSubmit }: QuestionFormProps) => {
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [topics, setTopics] = useState("");
  const [tags, setTags] = useState("");

  // For now, just a simple handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        question,
        explanation,
        topics: topics.split(",").map((t) => t.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    }
    setQuestion("");
    setExplanation("");
    setTopics("");
    setTags("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium mb-1">Question</label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the recall exam question"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Explanation</label>
        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Provide a detailed explanation"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Topics (comma separated)</label>
        <Input
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="e.g. Cardiology, Arrhythmia"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Tags (comma separated)</label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. ECG, Emergency"
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Question
      </Button>
    </form>
  );
};