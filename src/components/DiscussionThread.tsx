import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Comment = {
  id: number;
  user: string;
  text: string;
};

export const DiscussionThread = () => {
  const [comments, setComments] = useState<Comment[]>([
    // Example comment
    { id: 1, user: "Dr. Smith", text: "Great question! I think the answer is B because..." },
  ]);
  const [input, setInput] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setComments([
        ...comments,
        { id: Date.now(), user: "Anonymous", text: input.trim() },
      ]);
      setInput("");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="font-semibold mb-2">Discussion</h3>
      <ul className="space-y-2 mb-2">
        {comments.map((c) => (
          <li key={c.id} className="text-sm">
            <span className="font-medium">{c.user}:</span> {c.text}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleAddComment}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button type="submit" size="sm">
          Post
        </Button>
      </form>
    </div>
  );
};