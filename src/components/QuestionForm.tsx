import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MDEditor from "@uiw/react-md-editor";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
};

export const QuestionForm = ({ onSubmit }: QuestionFormProps) => {
  const [question, setQuestion] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [discussion, setDiscussion] = useState<string>("");
  const [topics, setTopics] = useState("");
  const [hasOptions, setHasOptions] = useState(false);
  const [options, setOptions] = useState<Record<string, string>>({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const addOption = () => {
    const keys = Object.keys(options);
    if (keys.length < 7) {
      const nextLetter = String.fromCharCode(keys[keys.length - 1].charCodeAt(0) + 1);
      setOptions(prev => ({ ...prev, [nextLetter]: "" }));
    }
  };

  const removeOption = () => {
    const keys = Object.keys(options);
    if (keys.length > 4) {
      const newOptions = { ...options };
      delete newOptions[keys[keys.length - 1]];
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        question,
        explanation,
        discussion,
        topics: topics.split(",").map((t) => t.trim()).filter(Boolean),
        options: hasOptions ? options : undefined,
      });
    }
    setQuestion("");
    setExplanation("");
    setDiscussion("");
    setTopics("");
    setOptions({
      A: "",
      B: "",
      C: "",
      D: "",
    });
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

      <div className="flex items-center space-x-2">
        <Switch
          id="has-options"
          checked={hasOptions}
          onCheckedChange={setHasOptions}
        />
        <Label htmlFor="has-options">Add multiple choice options</Label>
      </div>

      {hasOptions && (
        <div className="space-y-2">
          <Label>Options (A-G)</Label>
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className="w-8 font-bold">{key}.</span>
              <Input
                value={value}
                onChange={(e) => handleOptionChange(key, e.target.value)}
                placeholder={`Option ${key}`}
              />
            </div>
          ))}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={Object.keys(options).length >= 7}
            >
              Add Option
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeOption}
              disabled={Object.keys(options).length <= 4}
            >
              Remove Option
            </Button>
          </div>
        </div>
      )}

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
      <Button type="submit" className="w-full">
        Submit Question
      </Button>
    </form>
  );
};