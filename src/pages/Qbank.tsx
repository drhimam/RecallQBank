import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  Lock,
  Unlock,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Settings,
  Plus,
  Filter,
  Sliders
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for statistics
const mockStats = {
  totalQuestions: 1240,
  contributed: 24,
  unlocked: 48, // 24 contributions * 2 questions each
  subscriptionActive: false,
  subscriptionQuestions: 1240,
  answered: 32,
  correct: 28,
  streak: 5,
  lastWeek: [
    { day: "Mon", count: 5 },
    { day: "Tue", count: 3 },
    { day: "Wed", count: 7 },
    { day: "Thu", count: 4 },
    { day: "Fri", count: 6 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 8 },
  ]
};

// Mock questions data
const mockQuestions = [
  {
    id: 1,
    question: "A 65-year-old man presents with chest pain and shortness of breath that started 2 hours ago. He has a history of hypertension and type 2 diabetes. On examination, his blood pressure is 160/95 mmHg, heart rate is 110 bpm, and respiratory rate is 22/min. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most appropriate immediate management?",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Chest Pain", "Acute Coronary Syndrome"],
    tags: ["ECG", "Emergency"],
    status: "unlocked",
    options: [
      { id: "A", text: "Administer sublingual nitroglycerin and aspirin" },
      { id: "B", text: "Perform urgent coronary angiography" },
      { id: "C", text: "Start heparin infusion" },
      { id: "D", text: "Give beta-blocker to control heart rate" }
    ],
    correctAnswer: "B",
    explanation: "In a patient with STEMI (ST-elevation myocardial infarction), the most appropriate immediate management is urgent coronary angiography with possible percutaneous coronary intervention (PCI). This is the definitive treatment for STEMI and should be performed within 90 minutes of first medical contact if possible. While aspirin and nitroglycerin are important initial treatments, they are not the definitive management. Heparin may be used as an adjunct, and beta-blockers are not first-line for immediate management in STEMI.",
    discussion: "STEMI is a medical emergency requiring immediate reperfusion therapy. Primary PCI is preferred over fibrinolytic therapy when available within 90-120 minutes. Door-to-balloon time should be less than 90 minutes. Time is muscle - the sooner reperfusion occurs, the better the outcome."
  },
  {
    id: 2,
    question: "Which of the following is NOT a feature of nephrotic syndrome?",
    exam: "FCPS",
    subject: "Nephrology",
    topics: ["Renal", "Proteinuria"],
    tags: ["Urine", "Lab"],
    status: "unlocked",
    options: [
      { id: "A", text: "Proteinuria > 3.5g/day" },
      { id: "B", text: "Hypoalbuminemia" },
      { id: "C", text: "Hyperlipidemia" },
      { id: "D", text: "Hematuria" }
    ],
    correctAnswer: "D",
    explanation: "Nephrotic syndrome is characterized by the classic triad of heavy proteinuria (>3.5g/day), hypoalbuminemia, and edema. Hyperlipidemia is also commonly present due to increased hepatic lipoprotein synthesis. Hematuria, however, is not a feature of nephrotic syndrome but rather of nephritic syndrome, which is characterized by hematuria, hypertension, and reduced glomerular filtration rate.",
    discussion: "Nephrotic syndrome results from increased glomerular permeability to proteins. The primary defect is in the glomerular basement membrane or podocyte structure. Common causes include minimal change disease (in children), focal segmental glomerulosclerosis, and membranous nephropathy (in adults)."
  },
  {
    id: 3,
    question: "Management of acute myocardial infarction includes all EXCEPT:",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["MI", "Emergency"],
    tags: ["Pharmacology"],
    status: "locked",
    options: [
      { id: "A", text: "Aspirin" },
      { id: "B", text: "Nitroglycerin" },
      { id: "C", text: "Beta-blockers" },
      { id: "D", text: "Calcium channel blockers" }
    ],
    correctAnswer: "D",
    explanation: "Calcium channel blockers are not routinely used in the acute management of myocardial infarction and may actually be harmful in some cases. Aspirin is an antiplatelet agent that is essential in MI management. Nitroglycerin helps with chest pain and reduces preload. Beta-blockers reduce myocardial oxygen demand and are beneficial in MI.",
    discussion: "The management of acute MI focuses on rapid reperfusion, pain relief, and reducing myocardial oxygen demand. Modern treatment includes dual antiplatelet therapy (aspirin plus a P2Y12 inhibitor), anticoagulation, and prompt reperfusion either by primary PCI or fibrinolysis."
  },
  {
    id: 4,
    question: "A patient presents with sudden onset severe headache described as 'the worst headache of my life'. Which investigation is most appropriate?",
    exam: "USMLE",
    subject: "Neurology",
    topics: ["Headache", "Emergency"],
    tags: ["Imaging"],
    status: "locked",
    options: [
      { id: "A", text: "CT scan of the head without contrast" },
      { id: "B", text: "MRI of the brain" },
      { id: "C", text: "Lumbar puncture" },
      { id: "D", text: "CT angiography" }
    ],
    correctAnswer: "A",
    explanation: "In a patient presenting with sudden onset severe headache ('thunderclap headache'), the immediate concern is subarachnoid hemorrhage (SAH). Non-contrast CT scan of the head is the first-line investigation as it is highly sensitive for detecting SAH, especially within the first 6 hours of symptom onset. If CT is negative but clinical suspicion remains high, lumbar puncture should be performed.",
    discussion: "Thunderclap headache is a medical emergency that requires immediate evaluation. Other causes include reversible cerebral vasoconstriction syndrome, cerebral venous sinus thrombosis, and pituitary apoplexy. The classic presentation of SAH is a sudden, severe headache that reaches maximum intensity within seconds to minutes."
  }
];

// Mock Qbank-wide statistics
const qbankStats = {
  exams: [
    { name: "MRCP", total: 420, unlocked: 15 },
    { name: "FCPS", total: 380, unlocked: 12 },
    { name: "USMLE", total: 320, unlocked: 8 },
    { name: "NEET-PG", total: 120, unlocked: 5 }
  ],
  subjects: [
    { name: "Cardiology", total: 280, unlocked: 18 },
    { name: "Nephrology", total: 190, unlocked: 10 },
    { name: "Neurology", total: 220, unlocked: 7 },
    { name: "Pharmacology", total: 180, unlocked: 5 },
    { name: "Pathology", total: 150, unlocked: 3 },
    { name: "Physiology", total: 120, unlocked: 2 },
    { name: "Medicine", total: 100, unlocked: 1 }
  ]
};

// Mock question sets
const mockQuestionSets = [
  { id: 1, name: "Cardiology Review", exam: "MRCP", subject: "Cardiology", count: 25, createdAt: "2023-05-15" },
  { id: 2, name: "Nephrology Basics", exam: "FCPS", subject: "Nephrology", count: 18, createdAt: "2023-06-22" },
  { id: 3, name: "Neurology Emergencies", exam: "USMLE", subject: "Neurology", count: 32, createdAt: "2023-07-10" }
];

const Qbank = () => {
  const [mode, setMode] = useState<"study" | "test">("study");
  const [activeTab, setActiveTab] = useState<"statistics" | "questions">("questions");
  const [answered, setAnswered] = useState<number[]>([0, 1]); // indices of answered questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testSettings, setTestSettings] = useState({
    timeLimit: 60, // minutes
    questionsPerTest: 10,
    randomizeQuestions: true,
    showTimer: true
  });
  const [studyFilters, setStudyFilters] = useState({
    exam: "",
    subject: "",
    topics: [] as string[],
    tags: [] as string[]
  });
  const [showCreateSetDialog, setShowCreateSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [selectedQuestionsForSet, setSelectedQuestionsForSet] = useState<number[]>([]);
  const [activeQuestionSet, setActiveQuestionSet] = useState<number | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  // Filter questions based on access
  const unlockedQuestions = mockQuestions.filter(q => q.status === "unlocked");
  const lockedQuestions = mockQuestions.filter(q => q.status === "locked");
  const currentQuestion = unlockedQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0 && mode === "test") {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && mode === "test") {
      setIsTimerRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeRemaining, mode]);

  const handleMarkAnswered = (idx: number) => {
    if (!answered.includes(idx)) {
      setAnswered((prev) => [...prev, idx]);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    if (mode === "study") {
      setShowExplanation(true);
    } else {
      // For test mode, store answer
      setTestAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answerId
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < unlockedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(mode === "test" ? testAnswers[currentQuestionIndex + 1] || null : null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(mode === "test" ? testAnswers[currentQuestionIndex - 1] || null : null);
      setShowExplanation(false);
    }
  };

  const handleShowAnswer = () => {
    setShowExplanation(true);
  };

  const handleStartTest = () => {
    setMode("test");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeRemaining(testSettings.timeLimit * 60);
    setIsTimerRunning(true);
  };

  const handlePauseTest = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleEndTest = () => {
    setMode("study");
    setIsTimerRunning(false);
  };

  const handleCreateQuestionSet = () => {
    if (newSetName.trim()) {
      // In a real app, this would save to backend
      console.log("Creating question set:", newSetName);
      setShowCreateSetDialog(false);
      setNewSetName("");
      setSelectedQuestionsForSet([]);
    }
  };

  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestionsForSet(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleFlagQuestion = (index: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Calculate progress percentages
  const contributionProgress = Math.min(100, (mockStats.unlocked / mockStats.totalQuestions) * 100);
  const subscriptionProgress = mockStats.subscriptionActive ? 100 : 0;
  const answeredProgress = (mockStats.answered / mockStats.unlocked) * 100;

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Qbank</h1>
          <div className="flex gap-2">
            <Button
              variant={mode === "study" ? "default" : "outline"}
              onClick={() => setMode("study")}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Study Mode
            </Button>
            <Button
              variant={mode === "test" ? "default" : "outline"}
              onClick={mode === "test" ? handleEndTest : handleStartTest}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {mode === "test" ? "End Test" : "Test Mode"}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "statistics"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("statistics")}
          >
            Statistics
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "questions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </div>

        {activeTab === "statistics" ? (
          /* Statistics Tab */
          <div className="space-y-6">
            {/* Access Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Unlocked Questions
                  </CardTitle>
                  <CardDescription>
                    Based on your contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-200">
                    {mockStats.unlocked}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    of {mockStats.totalQuestions} total questions
                  </div>
                  <Progress value={contributionProgress} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Answered Questions
                  </CardTitle>
                  <CardDescription>
                    Your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-200">
                    {mockStats.answered}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {mockStats.correct} answered correctly
                  </div>
                  <Progress value={answeredProgress} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Current Streak
                  </CardTitle>
                  <CardDescription>
                    Daily practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-200">
                    {mockStats.streak}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    days in a row
                  </div>
                  <div className="flex items-center mt-3 text-xs text-purple-600 dark:text-purple-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Completed today</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Access Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Contributions</span>
                      <span className="text-sm text-gray-500">{mockStats.contributed} contributions</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Each contribution unlocks 2 questions
                    </div>
                    <Progress value={contributionProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Subscription</span>
                      <span className="text-sm text-gray-500">
                        {mockStats.subscriptionActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {mockStats.subscriptionActive 
                        ? "Full access to all questions" 
                        : "Subscribe for unlimited access"}
                    </div>
                    <Progress value={subscriptionProgress} className="h-2" />
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" variant={mockStats.subscriptionActive ? "outline" : "default"}>
                      {mockStats.subscriptionActive ? "Manage Subscription" : "Subscribe for Full Access"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32">
                    {mockStats.lastWeek.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                          style={{ height: `${(day.count / 10) * 100}%` }}
                        />
                        <span className="text-xs mt-2 text-gray-500">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You've answered {mockStats.lastWeek.reduce((sum, day) => sum + day.count, 0)} questions this week
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Qbank-wide Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By Exam */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Questions by Exam
                  </CardTitle>
                  <CardDescription>
                    Distribution across different medical exams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qbankStats.exams.map((exam, index) => {
                    const percentage = (exam.unlocked / exam.total) * 100;
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{exam.name}</span>
                          <span className="text-sm text-gray-500">
                            {exam.unlocked} / {exam.total}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* By Subject */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Questions by Subject
                  </CardTitle>
                  <CardDescription>
                    Distribution across medical subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qbankStats.subjects.map((subject, index) => {
                    const percentage = (subject.unlocked / subject.total) * 100;
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <span className="text-sm text-gray-500">
                            {subject.unlocked} / {subject.total}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Questions Tab - Contains both Study and Test Modes */
          <div className="space-y-6">
            {mode === "study" ? (
              /* Study Mode */
              <div className="space-y-6">
                {/* Study Setup Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sliders className="w-5 h-5" />
                        Study Configuration
                      </span>
                      <div className="flex gap-2">
                        <Dialog open={showCreateSetDialog} onOpenChange={setShowCreateSetDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Create Set
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Question Set</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="setName">Set Name</Label>
                                <Input
                                  id="setName"
                                  value={newSetName}
                                  onChange={(e) => setNewSetName(e.target.value)}
                                  placeholder="e.g., Cardiology Review"
                                />
                              </div>
                              <div>
                                <Label>Selected Questions: {selectedQuestionsForSet.length}</Label>
                                <div className="text-sm text-gray-500 mt-1">
                                  Select questions below to add to this set
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowCreateSetDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateQuestionSet} disabled={!newSetName.trim()}>
                                  Create Set
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-1" />
                          Filters
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Select value={studyFilters.exam} onValueChange={(v) => setStudyFilters({...studyFilters, exam: v})}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Exams</SelectItem>
                          <SelectItem value="MRCP">MRCP</SelectItem>
                          <SelectItem value="FCPS">FCPS</SelectItem>
                          <SelectItem value="USMLE">USMLE</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={studyFilters.subject} onValueChange={(v) => setStudyFilters({...studyFilters, subject: v})}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Nephrology">Nephrology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline">
                        Topics
                      </Button>
                      <Button variant="outline">
                        Tags
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {unlockedQuestions.length} unlocked questions
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Randomize
                        </Button>
                        <Button variant="outline" size="sm">
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Sets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card 
                    className={`cursor-pointer border-2 ${activeQuestionSet === null ? 'border-blue-500' : ''}`}
                    onClick={() => setActiveQuestionSet(null)}
                  >
                    <CardContent className="p-4">
                      <div className="font-medium">All Unlocked Questions</div>
                      <div className="text-sm text-gray-500">{unlockedQuestions.length} questions</div>
                    </CardContent>
                  </Card>
                  
                  {mockQuestionSets.map((set) => (
                    <Card 
                      key={set.id}
                      className={`cursor-pointer border-2 ${activeQuestionSet === set.id ? 'border-blue-500' : ''}`}
                      onClick={() => setActiveQuestionSet(set.id)}
                    >
                      <CardContent className="p-4">
                        <div className="font-medium">{set.name}</div>
                        <div className="text-sm text-gray-500">{set.count} questions</div>
                        <div className="text-xs text-gray-400 mt-1">{set.exam} • {set.subject}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Current Question */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{currentQuestion?.exam}</Badge>
                    <Badge variant="outline">{currentQuestion?.subject}</Badge>
                    {currentQuestion?.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? "text-blue-600" : ""}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFlagged(!isFlagged)}
                      className={isFlagged ? "text-red-600" : ""}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {currentQuestionIndex + 1} of {unlockedQuestions.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-gray-800 dark:text-gray-200">{currentQuestion?.question}</p>
                    
                    <RadioGroup 
                      value={selectedAnswer || ""} 
                      onValueChange={handleAnswerSelect}
                      className="space-y-3 mb-6"
                    >
                      {currentQuestion?.options.map((option) => (
                        <div 
                          key={option.id} 
                          className={`flex items-start p-3 rounded-lg border ${
                            selectedAnswer === option.id 
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                              : "border-gray-200 dark:border-gray-700"
                          } ${
                            showExplanation && option.id === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : ""
                          } ${
                            showExplanation && selectedAnswer === option.id && option.id !== currentQuestion.correctAnswer
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                        >
                          <RadioGroupItem 
                            value={option.id} 
                            id={option.id} 
                            className="mt-1"
                            disabled={showExplanation}
                          />
                          <Label 
                            htmlFor={option.id} 
                            className="ml-3 flex-1 text-gray-800 dark:text-gray-200 cursor-pointer"
                          >
                            <span className="font-medium mr-2">{option.id}.</span>
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {showExplanation && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">Explanation:</h3>
                          <p className="text-gray-700 dark:text-gray-300">{currentQuestion?.explanation}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Discussion:</h3>
                          <p className="text-gray-700 dark:text-gray-300">{currentQuestion?.discussion}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Helpful
                            </Button>
                            <Button variant="outline" size="sm">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Not Helpful
                            </Button>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Discuss
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">My Notes</Label>
                        <Textarea
                          id="notes"
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder="Add your notes here..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    {!showExplanation && selectedAnswer && (
                      <Button onClick={handleShowAnswer}>
                        Check Answer
                      </Button>
                    )}
                    <Button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === unlockedQuestions.length - 1}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Test Mode */
              <div className="space-y-6">
                {/* Test Setup Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Test Configuration
                      </span>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-1" />
                        Customize
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Time Limit</Label>
                        <Select 
                          value={testSettings.timeLimit.toString()} 
                          onValueChange={(v) => setTestSettings({...testSettings, timeLimit: parseInt(v)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">120 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Questions</Label>
                        <Select 
                          value={testSettings.questionsPerTest.toString()} 
                          onValueChange={(v) => setTestSettings({...testSettings, questionsPerTest: parseInt(v)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 questions</SelectItem>
                            <SelectItem value="20">20 questions</SelectItem>
                            <SelectItem value="30">30 questions</SelectItem>
                            <SelectItem value="50">50 questions</SelectItem>
                            <SelectItem value="100">100 questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-5">
                        <Switch
                          id="randomize"
                          checked={testSettings.randomizeQuestions}
                          onCheckedChange={(checked) => setTestSettings({...testSettings, randomizeQuestions: checked})}
                        />
                        <Label htmlFor="randomize">Randomize Questions</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-5">
                        <Switch
                          id="timer"
                          checked={testSettings.showTimer}
                          onCheckedChange={(checked) => setTestSettings({...testSettings, showTimer: checked})}
                        />
                        <Label htmlFor="timer">Show Timer</Label>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Exams</SelectItem>
                          <SelectItem value="MRCP">MRCP</SelectItem>
                          <SelectItem value="FCPS">FCPS</SelectItem>
                          <SelectItem value="USMLE">USMLE</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Nephrology">Nephrology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline">
                        Topics
                      </Button>
                      <Button variant="outline">
                        Tags
                      </Button>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={handleStartTest}>
                        Start Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Mode Question Display */}
                {mode === "test" && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{currentQuestion?.exam}</Badge>
                        <Badge variant="outline">{currentQuestion?.subject}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        {testSettings.showTimer && (
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded font-mono ${
                              timeRemaining < 300 ? "text-red-600 bg-red-100" : "text-gray-700 bg-gray-100"
                            }`}>
                              {formatTime(timeRemaining)}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePauseTest}
                            >
                              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Question {currentQuestionIndex + 1} of {Math.min(testSettings.questionsPerTest, unlockedQuestions.length)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-6 text-gray-800 dark:text-gray-200">{currentQuestion?.question}</p>
                        
                        <RadioGroup 
                          value={selectedAnswer || ""} 
                          onValueChange={handleAnswerSelect}
                          className="space-y-3 mb-6"
                        >
                          {currentQuestion?.options.map((option) => (
                            <div 
                              key={option.id} 
                              className={`flex items-start p-3 rounded-lg border ${
                                selectedAnswer === option.id 
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                                  : "border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <RadioGroupItem 
                                value={option.id} 
                                id={option.id} 
                                className="mt-1"
                              />
                              <Label 
                                htmlFor={option.id} 
                                className="ml-3 flex-1 text-gray-800 dark:text-gray-200 cursor-pointer"
                              >
                                <span className="font-medium mr-2">{option.id}.</span>
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between">
                      <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          {flaggedQuestions.includes(currentQuestionIndex) ? "Unflag" : "Flag"}
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={currentQuestionIndex === Math.min(testSettings.questionsPerTest, unlockedQuestions.length) - 1}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Test Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Answered: {Object.keys(testAnswers).length} of {Math.min(testSettings.questionsPerTest, unlockedQuestions.length)}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Flagged: {flaggedQuestions.length}
                          </span>
                        </div>
                        <Progress 
                          value={(Object.keys(testAnswers).length / Math.min(testSettings.questionsPerTest, unlockedQuestions.length)) * 100} 
                          className="mb-4" 
                        />
                        <div className="flex justify-center gap-2">
                          {Array.from({ length: Math.min(testSettings.questionsPerTest, unlockedQuestions.length) }).map((_, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full cursor-pointer ${
                                index === currentQuestionIndex
                                  ? "bg-blue-600"
                                  : testAnswers[index]
                                  ? "bg-green-500"
                                  : flaggedQuestions.includes(index)
                                  ? "bg-red-500"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                              onClick={() => {
                                setCurrentQuestionIndex(index);
                                setSelectedAnswer(testAnswers[index] || null);
                              }}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Qbank;