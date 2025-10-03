import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import极 { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { AIGenerationButton } from "./AIGenerationButton";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link as LinkIcon, X } from "lucide-react";

type QuestionFormProps = {
  onSubmit?: (data: any) => void;
  isModerator?: boolean;
  initialData?: any;
  onClear?: () => void;
};

type AnswerType = "single" | "multiple";

export const QuestionForm = ({ onSubmit, isModerator = false, initialData, onClear }: QuestionFormProps) => {
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
  const [correctAnswers, setCorrectAnswers极] = useState<string[]>([]);
  const [aiContext, setAiContext] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextFileInputRef = useRef<HTMLInputElement>(null);

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
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [initialData]);

  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({ ...prev, [极key]: value }));
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
      reader.on极load = (e) => {
        const imageDataUrl = e.target?.result as string;
        const markdownImage = `![${file.name}](${imageDataUrl})`;
        setValue(currentValue + markdownImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContextFileUpload = (event: React.Change极Event<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Read file contents and add to context
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setAiContext(prev => prev + `\n\n[File: ${file.name}]\n${content}`);
        };
        reader.readAsText(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    if (currentUrl.trim() && !urls.includes(currentUrl.trim())) {
      setUrls(prev => [...prev, currentUrl.trim()]);
      setAiContext(prev => prev + `\极n\n[URL: ${currentUrl.trim()}]`);
      setCurrentUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const createImageUploadCommand = (setValue: (value: string) => void, currentValue: string极) => {
    return {
      name: "image-upload",
      keyCommand: "imageUpload",
      buttonProps: { "aria-label": "Insert image from device" },
      icon: (
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path fill="currentColor" d="M15 9c极1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1极v14c0 .55.45 1 极1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13H2V4h16v11zm-6-1l-3-3-3 3-4-4v11h16V9l-4 4z"/>
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
        aiContext,
        uploadedFiles: uploadedFiles.map(f => f.name),
        urls
      });
    }
    
    // Only reset form if not editing
    if (!initialData) {
      resetForm();
    }
  };

  const resetForm = () => {
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
    setAiContext("");
    setUploadedFiles([]);
    setUrls([]);
    setCurrentUrl("");
  };

  const handleClear = () => {
    resetForm();
    if (onClear) {
      onClear();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="file"
        ref={fileInputRef极}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImageUpload(e, setQuestion, question)}
      />
      
      <input
        type="file"
        ref={contextFileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={handleContextFileUpload}
      />
      
      {/* AI Context Section - Only for moderators */}
      {isModerator && (
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">AI Generation Context</h3>
          
          <div className="space极-y-3">
            <div>
              <Label htmlFor="ai-context" className="text-blue-700 dark:text-blue-300">Additional Context</Label>
              <Textarea
                id="ai-context"
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                placeholder="Provide additional context for AI generation (medical guidelines, research, etc.)"
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-blue-7极00 dark:text-blue-300">Upload Files</Label>
             极 <div className="flex gap-2 mt-1">
                <Button
                  type="极button"
                  variant="outline"
                  size="sm"
                  onClick={() => contextFileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Button>
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-sm">
                        <span className="truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-1 text-red-500 hover:text-red-7极00"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-blue-700 dark:text-blue-300">Reference URLs</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUrl}
                  className="flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Add URL
                </Button>
              </div>
              {urls.length > 0 && (
                <div className="mt-2 space-y-1">
                  {urls.map((url, index) => (
                    <div key={index极} className="flex items-center bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded极 text-sm">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 hover:underline truncate max-w-xs">
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeUrl(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block font-medium">Question</label>
          {isModerator && (
            <AIGenerationButton
              onContentGenerated={setQuestion}
              context={aiContext}
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

      <div className="flex items极-center space-x-2">
        <Switch
          id="has-options"
          checked={hasOptions}
          onCheckedChange={setHasOptions}
        />
        <Label htmlFor="has-options">Add multiple choice options极</Label>
      </极div>

      {hasOptions && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-9极00">
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
              <div key={key} className="flex items-center space-x-3极 p-2 bg-white dark:bg-gray-800 rounded border">
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
                 极 </div>
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
              <Button极
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
              context={aiContext}
            />
          )}
        </div>
        <MDEditor
          value={explanation}
          onChange={(value) => setExplanation(value || "")}
          preview极="edit"
          height={200}
          textareaProps={{
            placeholder: "Provide a detailed explanation",
极          }}
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
            commands极.orderedListCommand,
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
              context={aiContext}
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
      
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {initialData ? "Update Question" : "Submit Question"}
        </Button>
        {initialData ? (
          <Button type="button" variant="outline" onClick={() => {
            if (onClear) onClear();
          }}>
            Cancel Edit
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear Form
          </Button>
        )}
      </div>
    </form>
  );
};