import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type CategorySelectorProps = {
  onChange?: (categories: {
    exam: string;
    subject: string;
    topics: string[];
    tags: string[];
  }) => void;
};

export const CategorySelector = ({ onChange }: CategorySelectorProps) => {
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      const newTopics = [...topics, topicInput.trim()];
      setTopics(newTopics);
      setTopicInput("");
      onChange?.({ exam, subject, topics: newTopics, tags });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput("");
      onChange?.({ exam, subject, topics, tags: newTags });
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block font-medium mb-1">Exam</label>
        <Input
          value={exam}
          onChange={(e) => {
            setExam(e.target.value);
            onChange?.({ exam: e.target.value, subject, topics, tags });
          }}
          placeholder="e.g. MRCP, FCPS"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Subject</label>
        <Input
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            onChange?.({ exam, subject: e.target.value, topics, tags });
          }}
          placeholder="e.g. Cardiology"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Topics</label>
        <div className="flex gap-2 mb-1">
          <Input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Add topic"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTopic())}
          />
          <button
            type="button"
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={handleAddTopic}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="outline">{topic}</Badge>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Tags</label>
        <div className="flex gap-2 mb-1">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
          />
          <button
            type="button"
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};