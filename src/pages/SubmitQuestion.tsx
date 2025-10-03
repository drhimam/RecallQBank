import { useState } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { CategorySelector } from "@/components/CategorySelector";
import { DuplicateChecker } from "@/components/DuplicateChecker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2, Eye } from "lucide-react";

const SubmitQuestion = () => {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<any>({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"create" | "edit">("create");
  
  // Mock user contributions data
  const [userContributions, setUserContributions] = useState([
    {
      id: 1,
      question: "A 65-year-old man presents with chest pain and shortness of breath. What is the most likely diagnosis?",
      options: ["A. Asthma", "B. Myocardial infarction", "C. Pneumonia", "D. GERD"],
      answer: "B. Myocardial infarction",
      explanation: "Classic presentation of MI in an elderly male.",
      exam: "MRCP",
      subject: "Cardiology",
      topics: ["Chest Pain", "Acute Coronary Syndrome"],
      tags: ["ECG", "Emergency"],
      status: "approved"
    },
    {
      id: 2,
      question: "Which of the following is NOT a feature of nephrotic syndrome?",
      options: ["A. Proteinuria", "B. Hypoalbuminemia", "C. Hyperlipidemia", "D. Hematuria"],
      answer: "D. Hematuria",
      explanation: "Hematuria is more typical of nephritic syndrome.",
      exam: "FCPS",
      subject: "Nephrology",
      topics: ["Renal", "Proteinuria"],
      tags: ["Urine", "Lab"],
      status: "pending"
    }
  ]);

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
    
    if (editingQuestion) {
      // Update existing question
      setUserContributions(prev => 
        prev.map(q => q.id === editingQuestion.id 
          ? { ...data, id: editingQuestion.id, status: "pending" }
          : q
        )
      );
      setEditingQuestion(null);
      setViewMode("create");
      toast.success("Question updated successfully!");
    } else {
      // Add new question
      const newQuestion = {
        id: Date.now(),
        ...data,
        ...categories,
        status: "pending"
      };
      setUserContributions(prev => [newQuestion, ...prev]);
      setSubmitted(true);
      toast.success("Question submitted! Awaiting admin approval.");
    }
    
    // Log the submitted data structure
    console.log("Submitted question:", {
      ...data,
      ...categories,
      correctAnswers: data.correctAnswers || []
    });
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setViewMode("edit");
    // Pre-fill categories if available
    if (question.exam || question.subject || question.topics || question.tags) {
      setCategories({
        exam: question.exam || "",
        subject: question.subject || "",
        topics: question.topics || [],
        tags: question.tags || []
      });
    }
  };

  const handleDelete = (id: number) => {
    setUserContributions(prev => prev.filter(q => q.id !== id));
    toast.success("Question deleted successfully!");
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setViewMode("create");
    setCategories({});
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Submit & Manage Questions</h1>
      <p className="text-gray-600 mb-6">
        Create new questions and manage your existing contributions in one place.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Submit/Edit Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {viewMode === "edit" ? "Edit Question" : "Submit New Question"}
            </h2>
            
            {viewMode === "edit" && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Editing question ID: {editingQuestion?.id}
                </p>
              </div>
            )}

            <CategorySelector onChange={setCategories} />
            <DuplicateChecker
              isDuplicate={isDuplicate}
              similarQuestions={[
                "Which of the following is NOT a feature of nephrotic syndrome?",
              ]}
            />
            <QuestionForm
              onSubmit={handleSubmit}
              isModerator={localStorage.getItem('userRole') === 'moderator'}
              initialData={editingQuestion}
              onClear={handleCancelEdit}
            />
          </div>
        </div>

        {/* Right Panel: My Contributions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Contributions</h2>
            <p className="text-gray-600 mb-4">
              {userContributions.length} question(s) submitted
            </p>

            {userContributions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No questions submitted yet</p>
                <p className="text-sm">Your submitted questions will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userContributions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
                        {question.question}
                      </h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded ${
                        question.status === "approved" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {question.status}
                      </span>
                      <span className="text-gray-500">
                        {question.exam} • {question.subject}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="font-semibold mb-3">Contribution Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {userContributions.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded">
                <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                  {userContributions.filter(q => q.status === "approved").length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">Approved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitted && !editingQuestion && (
        <div className="bg-green-100 text-green-800 rounded p-4 mt-6">
          Thank you for your contribution! Your question is pending review.
        </div>
      )}
    </div>
  );
};

export default SubmitQuestion;