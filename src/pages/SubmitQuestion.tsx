import { useState } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { CategorySelector } from "@/components/CategorySelector";
import { DuplicateChecker } from "@/components/DuplicateChecker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Edit, Trash2, Eye, Plus, BarChart3, FileText, CheckCircle, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";

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

    // Skip duplicate check when editing (only check for new submissions)
    if (!editingQuestion && data.question.toLowerCase().includes("nephrotic")) {
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
    
    // Reset duplicate state
    setIsDuplicate(false);
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
    setIsDuplicate(false);
  };

  // Calculate stats
  const totalQuestions = userContributions.length;
  const approvedQuestions = userContributions.filter(q => q.status === "approved").length;
  const pendingQuestions = userContributions.filter(q => q.status === "pending").length;
  const approvalRate = totalQuestions > 0 ? Math.round((approvedQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submit & Manage Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Contribute to our medical question bank and track your submissions in one convenient place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stats Cards */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Contribution Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white dark:bg-blue-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-200">
                    {totalQuestions}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-200">Total Questions</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-blue-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-200">
                    {approvedQuestions}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-200">Approved</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Approval Rate</span>
                  <span>{approvalRate}%</span>
                </div>
                <Progress value={approvalRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={() => window.scrollTo(0, 0)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Question
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  View All Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Submit/Edit Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {viewMode === "edit" ? (
                    <>
                      <Edit className="w-6 h-6" />
                      Edit Question
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Submit New Question
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {viewMode === "edit" 
                    ? `Editing question ID: ${editingQuestion?.id}`
                    : "Fill out the form below to contribute a new medical question"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: My Contributions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  My Contributions
                </CardTitle>
                <CardDescription>
                  {userContributions.length} question(s) submitted • {pendingQuestions} pending review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userContributions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No questions submitted yet</p>
                    <p className="text-sm">Your submitted questions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userContributions.map((question) => (
                      <Card key={question.id} className="bg-gray-50 dark:bg-gray-800 border-0">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-3">
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
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.exam && (
                              <Badge variant="secondary">{question.exam}</Badge>
                            )}
                            {question.subject && (
                              <Badge variant="outline">{question.subject}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <Badge
                              variant={question.status === "approved" ? "default" : "secondary"}
                              className="flex items-center gap-1"
                            >
                              {question.status === "approved" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {question.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {submitted && !editingQuestion && (
          <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mt-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Thank you for your contribution! Your question is pending review.</span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubmitQuestion;