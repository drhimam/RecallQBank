import { useState } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { CategorySelector } from "@/components/CategorySelector";
import { DuplicateChecker } from "@/components/DuplicateChecker";
import { toast } from "sonner";

const SubmitQuestion = () => {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<any>({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  
  // In a real app, this would come from authentication context
  const isModerator = localStorage.getItem('userRole') === 'moderator';

  const handleSubmit = (data: any) => {
    // Validate that correct answers are selected if options are provided
    if (data.options && (!data.correctAnswers || data.correctAnswers.length === 0)) {
      toast.error("Please select at least one correct answer");
      return;
    }

    // Simulate duplicate check
    if (data.question.toLowerCase().includes("nephrotic")) {
      setIsDuplicate(true);
      toast.error("Possible duplicate detected!");
      return;
    }
    
    setSubmitted(true);
    toast.success("Question submitted! Awaiting admin approval.");
    
    // Log the submitted data structure
    console.log("Submitted question:", {
      ...data,
      ...categories,
      correctAnswers: data.correctAnswers || []
    });
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
        <>
          <CategorySelector onChange={setCategories} />
          <DuplicateChecker
            isDuplicate={isDuplicate}
            similarQuestions={[
              "Which of the following is NOT a feature of nephrotic syndrome?",
            ]}
          />
          <QuestionForm
            onSubmit={(data) => handleSubmit({ ...data, ...categories })}
            isModerator={isModerator}
          />
        </>
      )}
    </div>
  );
};

export default SubmitQuestion;