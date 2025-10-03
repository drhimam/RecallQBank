import { QuestionCard } from "@/components/QuestionCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { DiscussionThread } from "@/components/DiscussionThread";
import { useState } from "react";

const exampleQuestions = [
  {
    question: "A 65-year-old man presents with chest pain and shortness of breath. What is the most likely diagnosis?",
    options: ["A. Asthma", "B. Myocardial infarction", "C. Pneumonia", "D. GERD"],
    answer: "B. Myocardial infarction",
    explanation: "Classic presentation of MI in an elderly male.",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Chest Pain", "Acute Coronary Syndrome"],
    tags: ["ECG", "Emergency"],
  },
  {
    question: "Which of the following is NOT a feature of nephrotic syndrome?",
    options: ["A. Proteinuria", "B. Hypoalbuminemia", "C. Hyperlipidemia", "D. Hematuria"],
    answer: "D. Hematuria",
    explanation: "Hematuria is more typical of nephritic syndrome.",
    exam: "FCPS",
    subject: "Nephrology",
    topics: ["Renal", "Proteinuria"],
    tags: ["Urine", "Lab"],
  },
];

const Qbank = () => {
  const [mode, setMode] = useState<"study" | "test">("study");
  const [answered, setAnswered] = useState(1);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Qbank</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${mode === "study" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("study")}
          >
            Study Mode
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === "test" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("test")}
          >
            Test Mode
          </button>
        </div>
      </div>
      <ProgressTracker current={answered} total={exampleQuestions.length} />
      <p className="text-gray-600 mb-4">
        Browse, study, or test yourself with contributed questions.
      </p>
      <div>
        {exampleQuestions.map((q, i) => (
          <div key={i}>
            <QuestionCard {...q} />
            <DiscussionThread />
          </div>
        ))}
      </div>
      {/* In the future, add pagination, filters, and real data */}
    </div>
  );
};

export default Qbank;