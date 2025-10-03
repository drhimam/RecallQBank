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
  XCircle
} from "lucide-react";
import { Footer } from "@/components/Footer";

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
    question: "A 65-year-old man presents with chest pain and shortness of breath. What is the most likely diagnosis?",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Chest Pain", "Acute Coronary Syndrome"],
    tags: ["ECG", "Emergency"],
    status: "unlocked"
  },
  {
    id: 2,
    question: "Which of the following is NOT a feature of nephrotic syndrome?",
    exam: "FCPS",
    subject: "Nephrology",
    topics: ["Renal", "Proteinuria"],
    tags: ["Urine", "Lab"],
    status: "unlocked"
  },
  {
    id: 3,
    question: "Management of acute myocardial infarction includes all EXCEPT:",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["MI", "Emergency"],
    tags: ["Pharmacology"],
    status: "locked"
  },
  {
    id: 4,
    question: "A patient presents with sudden onset severe headache. Which investigation is most appropriate?",
    exam: "USMLE",
    subject: "Neurology",
    topics: ["Headache", "Emergency"],
    tags: ["Imaging"],
    status: "locked"
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

const Qbank = () => {
  const [mode, setMode] = useState<"study" | "test">("study");
  const [activeTab, setActiveTab] = useState<"statistics" | "questions">("statistics");
  const [answered, setAnswered] = useState<number[]>([0, 1]); // indices of answered questions

  // Filter questions based on access
  const unlockedQuestions = mockQuestions.filter(q => q.status === "unlocked");
  const lockedQuestions = mockQuestions.filter(q => q.status === "locked");

  const handleMarkAnswered = (idx: number) => {
    if (!answered.includes(idx)) {
      setAnswered((prev) => [...prev, idx]);
    }
  };

  // Calculate progress percentages
  const contributionProgress = Math.min(100, (mockStats.unlocked / mockStats.totalQuestions) * 100);
  const subscriptionProgress = mockStats.subscriptionActive ? 100 : 0;
  const answeredProgress = (mockStats.answered / mockStats.unlocked) * 100;

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
              onClick={() => setMode("test")}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Test Mode
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
          /* Questions Tab */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Available Questions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {mockStats.unlocked} questions unlocked • {lockedQuestions.length} more with subscription
              </p>
            </div>

            <div className="space-y-4">
              {/* Unlocked Questions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-green-500" />
                    Unlocked Questions ({unlockedQuestions.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlockedQuestions.map((q, i) => (
                    <Card key={q.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                            {q.question}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {q.exam}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {q.subject}
                          </Badge>
                          {q.topics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {q.tags.map((tag, idx) => (
                              <Badge key={idx} variant="default" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            variant={answered.includes(i) ? "secondary" : "default"}
                            onClick={() => handleMarkAnswered(i)}
                          >
                            {answered.includes(i) ? "Answered" : "Answer"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Locked Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    Locked Questions ({lockedQuestions.length})
                  </h3>
                  <Button variant="outline" size="sm">
                    Subscribe for Full Access
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedQuestions.map((q) => (
                    <Card key={q.id} className="opacity-70">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                            {q.question}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {q.exam}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {q.subject}
                          </Badge>
                          {q.topics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {q.tags.map((tag, idx) => (
                              <Badge key={idx} variant="default" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" variant="outline" disabled>
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Qbank;