import { useState } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { toast } from "sonner";

const SubmitQuestion = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data: any) => {
    setSubmitted(true);
    toast.success("Question submitted! Awaiting admin approval.");
    // In the future, send to backend
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Submit a Question</h1>
      <p className="text-gray-600 mb-4">
        Contribute a recall exam question with explanation and related topics.
      </p>
      {submitted ? (
        <div className="bg-green-100 text-green-800 rounded p-4 mb-4">
          Thank you for your contribution! Your question is pending review.
        </div>
      ) : (
        <QuestionForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default SubmitQuestion;