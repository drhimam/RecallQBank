import { AlertCircle } from "lucide-react";

type DuplicateCheckerProps = {
  isDuplicate: boolean;
  similarQuestions?: string[];
};

export const DuplicateChecker = ({ isDuplicate, similarQuestions }: DuplicateCheckerProps) => {
  if (!isDuplicate) return null;
  return (
    <div className="bg-yellow-100 text-yellow-900 rounded p-3 mb-3 flex items-start gap-2">
      <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-700" />
      <div>
        <div className="font-semibold">Possible duplicate detected!</div>
        {similarQuestions && similarQuestions.length > 0 && (
          <ul className="list-disc list-inside text-sm mt-1">
            {similarQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}
        <div className="text-xs mt-1">Please check if your question is already in the database.</div>
      </div>
    </div>
  );
};