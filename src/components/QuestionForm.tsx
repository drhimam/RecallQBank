import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
};

export const QuestionForm = ({ onSubmit }: QuestionFormProps) => {
  const [question, setQuestion] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [discussion, setDiscussion] = useState<string>("");
  const [topics, setTopics] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        question,
        explanation,
        discussion,
        topics: topics.split(",").map((t) => t.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    }
    setQuestion("");
    setExplanation("");
    setDiscussion("");
    setTopics("");
    setTags("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium mb-1">Question</label>
        <div data-color-mode="light">
          <MDEditor
            value={question}
            onChange={setQuestion}
            height={120}
            preview="edit"
            textareaProps={{
              placeholder: "Enter the recall exam question (Markdown supported)",
              required: true,
            }}
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Explanation</label>
        <div data-color-mode="light">
          <MDEditor
            value={explanation}
            onChange={setExplanation}
            height={120}
            preview="edit"
            textareaProps={{
              placeholder: "Provide a detailed explanation (Markdown supported)",
              required: true,
            }}
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Discussion</label>
        <div data-color-mode="light">
          <MDEditor
            value={discussion}
            onChange={setDiscussion}
            height={100}
            preview="edit"
            textareaProps={{
              placeholder: "Write related topic discussion (Markdown supported)",
            }}
          />
        </div>
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