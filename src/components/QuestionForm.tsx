import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { AIGenerationButton } from "./AIGenerationButton";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
  isModerator?: boolean;
  initialData?: any;
};

type AnswerType = "single" | "multiple";

export const QuestionForm = ({ onSubmit, isModerator = false, initialData }: QuestionFormProps) => {
  const [question, setQuestion] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [discussion, setDiscussion] = useState<string>("");
  const [hasOptions, setHasOptions] = useState(false);
  const [answerType, setAnswerType] = useState<AnswerType>("single");
  const [options, setOptions] = useState<Record<string, string>>({
    A: "",
    B: "",
    C: "",
    D: "",
  });
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || "");
      setExplanation(initialData.explanation || "");
      setDiscussion(initialData.discussion || "");
      
      if (initialData.options) {
        setHasOptions(true);
        setOptions(initialData.options);
        setCorrectAnswers(initialData.correctAnswers || []);
        setAnswerType(initialData.answerType || "single");
      }
    }
  }, [initialData]);

  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleAnswerSelection = (key: string) => {
    if (answerType === "single") {
      setCorrectAnswers([key]);
    } else {
      setCorrectAnswers(prev =>
        prev.includes(key)
          ? prev.filter(k => k !== key)
          : [...prev, key]
      );
    }
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
      // Remove any correct answers that no longer exist
      setCorrectAnswers(prev => prev.filter(k => k in newOptions));
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
        answerType,
        correctAnswers,
      });
    }
    
    // Only reset form if not editing
    if (!initialData) {
      setQuestion("");
      setExplanation("");
      setDiscussion("");
      setOptions({
        A: "",
        B: "",
        C: "",
        D: "",
      });
      setCorrectAnswers([]);
      setAnswerType("single");
      setHasOptions(false);
    }
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
        <div className="flex items-center justify-between mb-1">
          <label className="block font-medium">Question</label>
          {isModerator && (
            <AIGenerationButton
              onContentGenerated={setQuestion}
              context="medical exam question"
            />
          )}
        </div>
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
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div>
            <Label className="font-semibold mb-2">Answer Type</Label>
            <RadioGroup
              value={answerType}
              onValueChange={(value: string) => {
                setAnswerType(value as AnswerType);
                setCorrectAnswers([]);
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="cursor-pointer">
                  Single Best Answer (Round)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="cursor-pointer">
                  Multiple Correct Answers (Square)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold">Options (A-G)</Label>
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded border">
                {answerType === "single" ? (
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${key}`}
                      name="correct-answer"
                      className="h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={correctAnswers.includes(key)}
                      onChange={() => handleAnswerSelection(key)}
                    />
                  </div>
                ) : (
                  <Checkbox
                    id={`option-${key}`}
                    checked={correctAnswers.includes(key)}
                    onCheckedChange={() => handleAnswerSelection(key)}
                  />
                )}
                <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer font-normal">
                  <span className="font-bold mr-2">{key}.</span>
                  <Input
                    value={value}
                    onChange={(e) => handleOptionChange(key, e.target.value)}
                    placeholder={`Option ${key}`}
                    className="flex-1"
                  />
                </Label>
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

          {correctAnswers.length > 0 && (
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded">
              <Label className="font-semibold">Selected Correct Answers:</Label>
              <div className="mt-1 text-sm">
                {correctAnswers.map(key => (
                  <span key={key} className="bg-green-200 dark:bg-green-700 px-2 py-1 rounded mr-2">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block font-medium">Explanation</label>
          {isModerator && (
            <AIGenerationButton
              onContentGenerated={setExplanation}
              context="medical explanation"
            />
          )}
        </div>
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
        <div className="flex items-center justify-between mb-1">
          <label className="block font-medium">Discussion</label>
          {isModerator && (
            <AIGenerationButton
              onContentGenerated={setDiscussion}
              context="medical discussion points"
            />
          )}
        </div>
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
        {initialData ? "Update Question" : "Submit Question"}
      </Button>
    </form>
  );
};