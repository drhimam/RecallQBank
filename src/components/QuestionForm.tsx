import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MDEditor, { commands } from "@uiw/react-md-editor";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setValue: (value: string) => void, currentValue: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        const markdownImage = `![${file.name}](${imageDataUrl})`;
        setValue(currentValue + markdownImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const createImageUploadCommand = (setValue: (value: string) => void, currentValue: string) => {
    return {
      name: "image-upload",
      keyCommand: "imageUpload",
      buttonProps: { "aria-label": "Insert image from device" },
      icon: (
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13H2V4h16v11zm-6-1l-3-3-3 3-4-4v11h16V9l-4 4z"/>
        </svg>
      ),
      execute: () => {
        fileInputRef.current?.click();
      },
    };
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
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImageUpload(e, setQuestion, question)}
      />
      
      <div>
        <label className="block font-medium mb-1">Question</label>
        <MDEditor
          value={question}
          onChange={(value) => setQuestion(value || "")}
          preview="edit"
          height={200}
          textareaProps={{
            placeholder: "Enter the recall exam question",
          }}
          data-color-mode="light"
          commands={[
            commands.undo,
            commands.redo,
            commands.group,
            commands.bold,
            commands.italic,
            commands.group,
            commands.link,
            commands.quote,
            commands.code,
            commands.group,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.group,
            createImageUploadCommand(setQuestion, question),
          ]}
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
        <MDEditor
          value={explanation}
          onChange={(value) => setExplanation(value || "")}
          preview="edit"
          height={200}
          textareaProps={{
            placeholder: "Provide a detailed explanation",
          }}
          data-color-mode="light"
          commands={[
            commands.undo,
            commands.redo,
            commands.group,
            commands.bold,
            commands.italic,
            commands.group,
            commands.link,
            commands.quote,
            commands.code,
            commands.group,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.group,
            createImageUploadCommand(setExplanation, explanation),
          ]}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Discussion</label>
        <MDEditor
          value={discussion}
          onChange={(value) => setDiscussion(value || "")}
          preview="edit"
          height={150}
          textareaProps={{
            placeholder: "Write related topic discussion",
          }}
          data-color-mode="light"
          commands={[
            commands.undo,
            commands.redo,
            commands.group,
            commands.bold,
            commands.italic,
            commands.group,
            commands.link,
            commands.quote,
            commands.code,
            commands.group,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.group,
            createImageUploadCommand(setDiscussion, discussion),
          ]}
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Question
      </Button>
    </form>
  );
};