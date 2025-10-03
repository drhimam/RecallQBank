import { Badge } from "@/components/ui/badge";

type QuestionCardProps = {
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  exam?: string;
  subject?: string;
  topics?: string[];
  tags?: string[];
};

export const QuestionCard = ({
  question,
  options,
  answer,
  explanation,
  exam,
  subject,
  topics,
  tags,
}: QuestionCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
      <div className="mb-2 text-sm text-gray-500 flex flex-wrap gap-2">
        {exam && <Badge variant="secondary">{exam}</Badge>}
        {subject && <Badge variant="secondary">{subject}</Badge>}
        {topics?.map((topic) => (
          <Badge key={topic} variant="outline">{topic}</Badge>
        ))}
        {tags?.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-2">{question}</h2>
      {options && (
        <ul className="mb-2 list-disc list-inside">
          {options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>
      )}
      {answer && (
        <div className="mb-2">
          <span className="font-semibold text-green-700 dark:text-green-400">Answer: </span>
          {answer}
        </div>
      )}
      {explanation && (
        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};