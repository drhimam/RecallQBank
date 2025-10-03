import { useState, useRef } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { CategorySelector } from "@/components/CategorySelector";
import { DuplicateChecker } from "@/components/DuplicateChecker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  Clock, 
  Search, 
  Upload, 
  FileJson, 
  FileSpreadsheet,
  Download,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Footer } from "@/components/Footer";

const SubmitQuestion = () => {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<any>({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Filter contributions based on search term
  const filteredContributions = userContributions.filter(contribution => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contribution.question.toLowerCase().includes(searchLower) ||
      contribution.exam.toLowerCase().includes(searchLower) ||
      contribution.subject.toLowerCase().includes(searchLower) ||
      contribution.topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
      contribution.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

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

  // Get current date and time for export
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  };

  // Export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(userContributions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `contributions-${getCurrentDateTime()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Exported to JSON successfully!");
  };

  const exportToMarkdown = () => {
    let markdownContent = `# My Question Contributions\n\n`;
    markdownContent += `Exported on: ${new Date().toLocaleString()}\n\n`;
    markdownContent += `Total questions: ${userContributions.length}\n\n`;
    markdownContent += `---\n\n`;
    
    userContributions.forEach((q, index) => {
      markdownContent += `## Question ${index + 1}\n\n`;
      markdownContent += `**Question:** ${q.question}\n\n`;
      if (q.options) {
        markdownContent += `**Options:**\n`;
        Object.entries(q.options).forEach(([key, value]) => {
          markdownContent += `- ${key}. ${value}\n`;
        });
        markdownContent += `\n`;
      }
      if (q.answer) {
        markdownContent += `**Answer:** ${q.answer}\n\n`;
      }
      if (q.explanation) {
        markdownContent += `**Explanation:** ${q.explanation}\n\n`;
      }
      markdownContent += `**Exam:** ${q.exam}\n\n`;
      markdownContent += `**Subject:** ${q.subject}\n\n`;
      if (q.topics && q.topics.length > 0) {
        markdownContent += `**Topics:** ${q.topics.join(", ")}\n\n`;
      }
      if (q.tags && q.tags.length > 0) {
        markdownContent += `**Tags:** ${q.tags.join(", ")}\n\n`;
      }
      markdownContent += `**Status:** ${q.status}\n\n`;
      markdownContent += `---\n\n`;
    });
    
    const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(markdownContent);
    const exportFileDefaultName = `contributions-${getCurrentDateTime()}.md`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Exported to Markdown successfully!");
  };

  const exportToExcel = () => {
    // Simple CSV export for now
    let csvContent = `Exported on: ${new Date().toLocaleString()}\n`;
    csvContent += "Question,Options,Answer,Explanation,Exam,Subject,Topics,Tags,Status\n";
    userContributions.forEach(q => {
      const options = q.options ? Object.entries(q.options).map(([k, v]) => `${k}. ${v}`).join("; ") : "";
      const topics = q.topics ? q.topics.join("; ") : "";
      const tags = q.tags ? q.tags.join("; ") : "";
      csvContent += `"${q.question}","${options}","${q.answer || ''}","${q.explanation || ''}","${q.exam}","${q.subject}","${topics}","${tags}","${q.status}"\n`;
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `contributions-${getCurrentDateTime()}.csv`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Exported to CSV successfully!");
  };

  const exportToPDF = () => {
    // In a real app, this would generate a PDF
    // For now, we'll just show a toast
    toast.info("PDF export would be implemented with a library like jsPDF in a real application");
  };

  // Import functions
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData)) {
            // Add imported questions to existing ones
            setUserContributions(prev => [...prev, ...jsonData.map((q: any) => ({
              ...q,
              id: Date.now() + Math.random() // Generate new IDs
            }))]);
            toast.success(`Imported ${jsonData.length} questions from JSON`);
          } else {
            toast.error("Invalid JSON format");
          }
        } else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
          // For CSV/Excel, we'd need a proper parser
          toast.info("Excel/CSV import would be implemented with a library like xlsx in a real application");
        }
      } catch (error) {
        toast.error("Error parsing file");
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
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
                {/* Search and Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions, topics, tags..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={handleImportClick}>
                      <Upload className="w-4 h-4 mr-1" />
                      Import
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".json,.csv,.xlsx"
                      onChange={handleFileImport}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={exportToJSON}>
                          <FileJson className="w-4 h-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToMarkdown}>
                          <FileText className="w-4 h-4 mr-2" />
                          Export as Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToExcel}>
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Export as Excel (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToPDF}>
                          <FileText className="w-4 h-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {filteredContributions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      {searchTerm ? "No matching questions found" : "No questions submitted yet"}
                    </p>
                    <p className="text-sm">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Your submitted questions will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredContributions.map((question) => (
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
                            {question.topics?.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {question.tags?.map((tag, idx) => (
                              <Badge key={idx} variant="default" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
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