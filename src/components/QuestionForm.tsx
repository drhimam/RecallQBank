import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
};

export const QuestionForm = ({ onSubmit }: QuestionFormProps) => {
  const [question, setQuestion] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [discussion, setDiscussion] = useState<string>("");
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
        options: hasOptions ? options : undefined,
      });
    }
    setQuestion("");
    setExplanation("");
    setDiscussion("");
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
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the recall exam question"
          required
          className="min-h-[120px]"
        />
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
        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Provide a detailed explanation"
          required
          className="min-h-[120px]"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Discussion</label>
        <Textarea
          value={discussion}
          onChange={(e) => setDiscussion(e.target.value)}
          placeholder="Write related topic discussion"
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Question
      </Button>
    </form>
  );
};