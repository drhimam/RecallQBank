import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Unlock,
  BarChart3,
  Clock,
  CheckCircle,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sliders
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Mode = "study" | "test";

// Mock data for statistics
const mockStats = {
  totalQuestions: 1240,
  contributed: 24,
  unlocked: 48,
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
  ],
};

// Mock questions data
const mockQuestions = [
  {
    id: 1,
    question:
      "A 65-year-old man presents with chest pain and shortness of breath that started 2 hours ago. He has a history of hypertension and type 2 diabetes. On examination, his blood pressure is 160/95 mmHg, heart rate is 110 bpm, and respiratory rate is 22/min. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most appropriate immediate management?",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Chest Pain", "Acute Coronary Syndrome"],
    tags: ["ECG", "Emergency"],
    status: "unlocked",
    options: [
      { id: "A", text: "Administer sublingual nitroglycerin and aspirin" },
      { id: "B", text: "Perform urgent coronary angiography" },
      { id: "C", text: "Start heparin infusion" },
      { id: "D", text: "Give beta-blocker to control heart rate" },
    ],
    correctAnswer: "B",
    explanation:
      "In a patient with STEMI (ST-elevation myocardial infarction), the most appropriate immediate management is urgent coronary angiography with possible percutaneous coronary intervention (PCI). This is the definitive treatment for STEMI and should be performed within 90 minutes of first medical contact if possible. While aspirin and nitroglycerin are important initial treatments, they are not the definitive management. Heparin may be used as an adjunct, and beta-blockers are not first-line for immediate management in STEMI.",
    discussion:
      "STEMI is a medical emergency requiring immediate reperfusion therapy. Primary PCI is preferred over fibrinolytic therapy when available within 90-120 minutes. Door-to-balloon time should be less than 90 minutes. Time is muscle - the sooner reperfusion occurs, the better the outcome.",
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
      { id: "D", text: "Hematuria" },
    ],
    correctAnswer: "D",
    explanation:
      "Nephrotic syndrome is characterized by the classic triad of heavy proteinuria (>3.5g/day), hypoalbuminemia, and edema. Hyperlipidemia is also commonly present due to increased hepatic lipoprotein synthesis. Hematuria, however, is not a feature of nephrotic syndrome but rather of nephritic syndrome, which is characterized by hematuria, hypertension, and reduced glomerular filtration rate.",
    discussion:
      "Nephrotic syndrome results from increased glomerular permeability to proteins. The primary defect is in the glomerular basement membrane or podocyte structure. Common causes include minimal change disease (in children), focal segmental glomerulosclerosis, and membranous nephropathy (in adults).",
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
      { id: "D", text: "Calcium channel blockers" },
    ],
    correctAnswer: "D",
    explanation:
      "Calcium channel blockers are not routinely used in the acute management of myocardial infarction and may actually be harmful in some cases. Aspirin is an antiplatelet agent that is essential in MI management. Nitroglycerin helps with chest pain and reduces preload. Beta-blockers reduce myocardial oxygen demand and are beneficial in MI.",
    discussion:
      "The management of acute MI focuses on rapid reperfusion, pain relief, and reducing myocardial oxygen demand. Modern treatment includes dual antiplatelet therapy (aspirin plus a P2Y12 inhibitor), anticoagulation, and prompt reperfusion either by primary PCI or fibrinolysis.",
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
      { id: "D", text: "CT angiography" },
    ],
    correctAnswer: "A",
    explanation:
      "In a patient presenting with sudden onset severe headache ('thunderclap headache'), the immediate concern is subarachnoid hemorrhage (SAH). Non-contrast CT scan of the head is the first-line investigation as it is highly sensitive for detecting SAH, especially within the first 6 hours of symptom onset. If CT is negative but clinical suspicion remains high, lumbar puncture should be performed.",
    discussion:
      "Thunderclap headache is a medical emergency that requires immediate evaluation. Other causes include reversible cerebral vasoconstriction syndrome, cerebral venous sinus thrombosis, and pituitary apoplexy. The classic presentation of SAH is a sudden, severe headache that reaches maximum intensity within seconds to minutes.",
  },
];

// Mock Qbank-wide statistics
const qbankStats = {
  exams: [
    { name: "MRCP", total: 420, unlocked: 15 },
    { name: "FCPS", total: 380, unlocked: 12 },
    { name: "USMLE", total: 320, unlocked: 8 },
    { name: "NEET-PG", total: 120, unlocked: 5 },
  ],
  subjects: [
    { name: "Cardiology", total: 280, unlocked: 18 },
    { name: "Nephrology", total: 190, unlocked: 10 },
    { name: "Neurology", total: 220, unlocked: 7 },
    { name: "Pharmacology", total: 180, unlocked: 5 },
    { name: "Pathology", total: 150, unlocked: 3 },
    { name: "Physiology", total: 120, unlocked: 2 },
    { name: "Medicine", total: 100, unlocked: 1 },
  ],
};

const Qbank = () => {
  const [mode, setMode] = useState<Mode>("study");
  const [activeTab, setActiveTab] = useState<"statistics" | "questions">("questions");

  // question navigation & state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // UI state
  const [userNotes, setUserNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  // timer / test state
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testSettings, setTestSettings] = useState({
    timeLimit: 60,
    questionsPerTest: 10,
    randomizeQuestions: true,
    showTimer: true,
    negativeMarking: false,
    negativeMarkValue: 0.25, // points per wrong answer
    passScore: 70, // percent required to pass
    allowCheckAnswer: true, // replaced allowReview with allowCheckAnswer
    breakInterval: 0, // minutes between breaks (0 = none)
    avoidPreviouslyCorrect: false,
  });

  // study settings (adjusted per request)
  const [studySettings, setStudySettings] = useState({
    includeLocked: false,
    numberOfQuestions: 20, // previously sessionLength, now number of questions
    spacedRepetition: false,
    includePreviouslyStudied: true,
    avoidPreviouslyCorrect: false,
  });

  // Mock previously studied / previously correct question IDs.
  // In a real app these should come from user profile / backend.
  const [previouslyStudiedIds] = useState<number[]>([1]); // user has studied question 1
  const [previouslyCorrectIds] = useState<number[]>([2]); // user answered question 2 correctly

  // multi-select filters for exams and subjects
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // configuration gating
  const [configured, setConfigured] = useState(false);

  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  // derive available exams and subjects from mockQuestions for multi-select options
  const availableExams = useMemo(() => {
    const s = new Set<string>();
    mockQuestions.forEach((q) => s.add(q.exam));
    return Array.from(s);
  }, []);

  const availableSubjects = useMemo(() => {
    const s = new Set<string>();
    mockQuestions.forEach((q) => s.add(q.subject));
    return Array.from(s);
  }, []);

  // Privilege handler: returns true if user can access locked content.
  const privilegedHandler = (questionStatus: string) => {
    if (questionStatus !== "locked") return true;
    // Allow access when subscription is active or user role is moderator/admin
    const userRole = localStorage.getItem("userRole"); // e.g., 'moderator' | 'subscriber'
    if (mockStats.subscriptionActive) return true;
    if (userRole === "moderator" || userRole === "admin") return true;
    return false;
  };

  // Compute how many questions are available given current exam/subject filters and privileges
  const maxAvailableQuestions = useMemo(() => {
    let base = mockQuestions;

    // apply exam filter: if 'all' selected or none selected -> include all
    if (selectedExams.length > 0 && !selectedExams.includes("all")) {
      base = base.filter((q) => selectedExams.includes(q.exam));
    }

    // apply subject filter
    if (selectedSubjects.length > 0 && !selectedSubjects.includes("all")) {
      base = base.filter((q) => selectedSubjects.includes(q.subject));
    }

    // count only questions the user can access (respect privileges)
    const accessible = base.filter((q) => q.status !== "locked" || privilegedHandler(q.status));
    return accessible.length;
  }, [selectedExams, selectedSubjects]);

  // Determine which questions to show based on configuration and privileges
  const shownQuestions = useMemo(() => {
    let base = mockQuestions;

    // Apply exams filter (if 'all' or none selected => don't filter)
    if (selectedExams.length > 0 && !selectedExams.includes("all")) {
      base = base.filter((q) => selectedExams.includes(q.exam));
    }

    // Apply subjects filter
    if (selectedSubjects.length > 0 && !selectedSubjects.includes("all")) {
      base = base.filter((q) => selectedSubjects.includes(q.subject));
    }

    if (mode === "study") {
      // Exclude locked unless includeLocked is true and user is privileged for those locked questions
      if (!studySettings.includeLocked) {
        base = base.filter((q) => q.status !== "locked");
      } else {
        base = base.filter((q) => q.status !== "locked" || privilegedHandler(q.status));
      }

      // Handle previously studied inclusion
      if (!studySettings.includePreviouslyStudied) {
        base = base.filter((q) => !previouslyStudiedIds.includes(q.id));
      }

      // Avoid previously correctly answered questions if requested
      if (studySettings.avoidPreviouslyCorrect) {
        base = base.filter((q) => !previouslyCorrectIds.includes(q.id));
      }

      // Limit to numberOfQuestions but cap at available items
      const limit = Math.max(1, Math.min(studySettings.numberOfQuestions, base.length));
      base = base.slice(0, limit);
    } else {
      // Test mode: include locked only if privileged
      base = base.filter((q) => q.status !== "locked" || privilegedHandler(q.status));

      // Note: 'Include previously studied' option was removed for test mode,
      // so we no longer filter based on previouslyStudiedIds here.

      // Avoid previously correct answers if requested
      if (testSettings.avoidPreviouslyCorrect) {
        base = base.filter((q) => !previouslyCorrectIds.includes(q.id));
      }

      // Limit to requested number of test questions
      base = base.slice(0, Math.max(1, Math.min(testSettings.questionsPerTest, base.length)));
    }

    // Randomize if requested
    if ((mode === "test" && testSettings.randomizeQuestions) || (mode === "study" && !studySettings.spacedRepetition)) {
      base = [...base].sort(() => Math.random() - 0.5);
    }

    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    studySettings,
    testSettings,
    selectedExams,
    selectedSubjects,
    previouslyStudiedIds,
    previouslyCorrectIds,
  ]);

  const currentQuestion = shownQuestions[currentQuestionIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isTimerRunning && timeRemaining > 0 && mode === "test") {
      timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerRunning, timeRemaining, mode]);

  // Validate configuration before revealing question content
  const validateConfiguration = () => {
    // For study: numberOfQuestions > 0 and not exceeding available
    if (mode === "study") {
      return studySettings.numberOfQuestions > 0 && studySettings.numberOfQuestions <= Math.max(1, maxAvailableQuestions);
    } else {
      // test mode: ensure positive time & questions & passScore valid
      return testSettings.questionsPerTest > 0 && testSettings.timeLimit > 0 && testSettings.passScore >= 0 && testSettings.passScore <= 100;
    }
  };

  const applyConfiguration = () => {
    if (!validateConfiguration()) {
      alert("Please complete the configuration before starting (ensure number of questions/time are valid).");
      return;
    }
    // reset question view state
    setConfigured(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    // set timer for test mode
    if (mode === "test") {
      setTimeRemaining(testSettings.timeLimit * 60);
      setIsTimerRunning(false);
    }
  };

  const resetConfiguration = () => {
    setConfigured(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    if (mode === "study") {
      setShowExplanation(true);
    } else {
      setTestAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answerId }));
    }
  };

  const handleNextQuestion = () => {
    const maxIndex = shownQuestions.length - 1;
    if (currentQuestionIndex < maxIndex) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(mode === "test" ? testAnswers[currentQuestionIndex + 1] || null : null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
      setSelectedAnswer(mode === "test" ? testAnswers[currentQuestionIndex - 1] || null : null);
      setShowExplanation(false);
    }
  };

  // Helper to update multi-select handling when 'all' chosen
  const handleExamMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
    if (vals.includes("all")) {
      setSelectedExams(["all"]);
    } else {
      setSelectedExams(vals);
    }
  };

  const handleSubjectMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
    if (vals.includes("all")) {
      setSelectedSubjects(["all"]);
    } else {
      setSelectedSubjects(vals);
    }
  };

  // Quick helpers
  const contributionProgress = Math.min(100, (mockStats.unlocked / mockStats.totalQuestions) * 100);
  const answeredProgress = (mockStats.answered / mockStats.unlocked) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Utility to determine whether checking answer is allowed in current mode
  const canCheckAnswer = () => {
    return mode === "study" ? true : testSettings.allowCheckAnswer;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Qbank</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("statistics")}>
              <Trophy className="w-4 h-4 mr-1" />
              View Stats
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
          <div className="space-y-6">
            {/* Statistics content unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Unlocked Questions
                  </CardTitle>
                  <CardDescription>Based on your contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-200">{mockStats.unlocked}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">of {mockStats.totalQuestions} total questions</div>
                  <Progress value={contributionProgress} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Answered Questions
                  </CardTitle>
                  <CardDescription>Your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-200">{mockStats.answered}</div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">{mockStats.correct} answered correctly</div>
                  <Progress value={answeredProgress} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Current Streak
                  </CardTitle>
                  <CardDescription>Daily practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-200">{mockStats.streak}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">days in a row</div>
                  <div className="flex items-center mt-3 text-xs text-purple-600 dark:text-purple-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Completed today</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mode switcher inside Questions tab */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant={mode === "study" ? "default" : "outline"} onClick={() => setMode("study")} className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Study
                </Button>
                <Button variant={mode === "test" ? "default" : "outline"} onClick={() => setMode("test")} className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Test
                </Button>
              </div>

              <div className="text-sm text-gray-500">Showing {shownQuestions.length} questions based on configuration</div>
            </div>

            {/* Configuration gating: show configuration card until user applies settings */}
            {!configured ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sliders className="w-5 h-5" />
                      {mode === "study" ? "Configure Study Mode" : "Configure Test Mode"}
                    </span>
                    <div className="text-sm text-gray-500">Complete configuration to view questions</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Multi-select for Exams */}
                  <div>
                    <Label className="text-sm font-medium">Select Exams</Label>
                    <select
                      multiple
                      value={selectedExams}
                      onChange={handleExamMultiSelect}
                      className="w-full border rounded p-2"
                    >
                      <option value="all">All Exams</option>
                      {availableExams.map((ex) => (
                        <option key={ex} value={ex}>
                          {ex}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple exams; choose "All Exams" or leave empty to include all.</div>
                  </div>

                  {/* Multi-select for Subjects */}
                  <div>
                    <Label className="text-sm font-medium">Select Subjects</Label>
                    <select
                      multiple
                      value={selectedSubjects}
                      onChange={handleSubjectMultiSelect}
                      className="w-full border rounded p-2"
                    >
                      <option value="all">All Subjects</option>
                      {availableSubjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects; choose "All Subjects" or leave empty to include all.</div>
                  </div>

                  {mode === "study" ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <Label className="text-sm font-medium">Number of Questions</Label>
                          <Input
                            type="number"
                            min={1}
                            max={Math.max(1, maxAvailableQuestions)}
                            value={studySettings.numberOfQuestions}
                            onChange={(e) => setStudySettings({ ...studySettings, numberOfQuestions: Math.max(1, Math.min(Number(e.target.value || 1), Math.max(1, maxAvailableQuestions))) })}
                          />
                          <div className="text-xs text-gray-500 mt-1">Max available based on your access: {maxAvailableQuestions}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="include-locked" checked={studySettings.includeLocked} onCheckedChange={(checked) => setStudySettings({ ...studySettings, includeLocked: !!checked })} />
                          <Label htmlFor="include-locked">Include locked questions (only shown if you have access)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="spaced-rep" checked={studySettings.spacedRepetition} onCheckedChange={(checked) => setStudySettings({ ...studySettings, spacedRepetition: !!checked })} />
                          <Label htmlFor="spaced-rep">Enable spaced repetition</Label>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch id="include-prev-studied" checked={studySettings.includePreviouslyStudied} onCheckedChange={(checked) => setStudySettings({ ...studySettings, includePreviouslyStudied: !!checked })} />
                          <Label htmlFor="include-prev-studied">Include previously studied questions</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="avoid-prev-correct" checked={studySettings.avoidPreviouslyCorrect} onCheckedChange={(checked) => setStudySettings({ ...studySettings, avoidPreviouslyCorrect: !!checked })} />
                          <Label htmlFor="avoid-prev-correct">Avoid previously correctly answered questions</Label>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Optionally choose topics/tags or leave exams/subjects as "All" to include the full accessible set.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                          <Label className="text-sm font-medium">Time Limit (minutes)</Label>
                          <Input
                            type="number"
                            min={5}
                            value={testSettings.timeLimit}
                            onChange={(e) => setTestSettings({ ...testSettings, timeLimit: Math.max(5, Number(e.target.value)) })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Number of Questions</Label>
                          <Input
                            type="number"
                            min={1}
                            value={testSettings.questionsPerTest}
                            onChange={(e) => setTestSettings({ ...testSettings, questionsPerTest: Math.max(1, Number(e.target.value)) })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Pass Score (%)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={testSettings.passScore}
                            onChange={(e) => setTestSettings({ ...testSettings, passScore: Math.min(100, Math.max(0, Number(e.target.value))) })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Negative Marking</Label>
                          <div className="flex items-center gap-2">
                            <Switch
                              id="negative"
                              checked={testSettings.negativeMarking}
                              onCheckedChange={(checked) => setTestSettings({ ...testSettings, negativeMarking: !!checked })}
                            />
                            {testSettings.negativeMarking && (
                              <Input
                                type="number"
                                step="0.05"
                                min={0}
                                max={1}
                                value={testSettings.negativeMarkValue}
                                onChange={(e) => setTestSettings({ ...testSettings, negativeMarkValue: Math.max(0, Number(e.target.value)) })}
                                className="w-28"
                              />
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Allow Check Answer</Label>
                          <Switch id="allow-check-answer" checked={testSettings.allowCheckAnswer} onCheckedChange={(checked) => setTestSettings({ ...testSettings, allowCheckAnswer: !!checked })} />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Break Interval (min)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={testSettings.breakInterval}
                            onChange={(e) => setTestSettings({ ...testSettings, breakInterval: Math.max(0, Number(e.target.value)) })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="test-avoid-prev-correct" checked={testSettings.avoidPreviouslyCorrect} onCheckedChange={(checked) => setTestSettings({ ...testSettings, avoidPreviouslyCorrect: !!checked })} />
                          <Label htmlFor="test-avoid-prev-correct">Avoid previously correctly answered questions</Label>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">Make sure time and number of questions are set before starting the test.</div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => { setConfigured(false); }}>
                      Cancel
                    </Button>
                    <Button onClick={applyConfiguration}>Apply & View Questions</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Reconfigure control */}
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={resetConfiguration}>
                    Reconfigure
                  </Button>
                </div>

                {/* Now show question content but gate locked questions by privilege */}
                {shownQuestions.length === 0 ? (
                  <Card>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-lg font-medium mb-2">No questions available for the selected configuration</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Try changing filters or enabling include locked (if you have access).
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* If the current question is locked and the user lacks privileges, show access message */}
                    {currentQuestion?.status === "locked" && !privilegedHandler(currentQuestion.status) ? (
                      <Card>
                        <CardContent>
                          <div className="text-center py-8">
                            <p className="text-lg font-semibold mb-2">Locked Content</p>
                            <p className="text-sm text-gray-600 mb-4">
                              This question is locked. Upgrade your access or contact an administrator to view locked questions.
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <Button onClick={() => alert("Open subscription / upgrade modal")}>Upgrade</Button>
                              <Button variant="outline" onClick={() => alert("Request access workflow")}>Request Access</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {/* Study mode: show two-panel layout */}
                        {mode === "study" ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left: Question + options */}
                            <div>
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Question {currentQuestionIndex + 1} of {shownQuestions.length}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="mb-6 text-gray-800 dark:text-gray-200">{currentQuestion?.question}</div>

                                  <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect} className="space-y-3 mb-6">
                                    {currentQuestion?.options.map((option: any) => (
                                      <div key={option.id} className={`flex items-start p-3 rounded-lg border ${selectedAnswer === option.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"} ${showExplanation && option.id === currentQuestion.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""} ${showExplanation && selectedAnswer === option.id && option.id !== currentQuestion.correctAnswer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}`}>
                                        <input type="radio" name="option" value={option.id} checked={selectedAnswer === option.id} onChange={() => handleAnswerSelect(option.id)} className="mt-1" />
                                        <Label htmlFor={option.id} className="ml-3 flex-1 text-gray-800 dark:text-gray-200 cursor-pointer">
                                          <span className="font-medium mr-2">{option.id}.</span>
                                          {option.text}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="notes" className="text-sm font-medium">My Notes</Label>
                                      <Textarea id="notes" value={userNotes} onChange={(e) => setUserNotes(e.target.value)} placeholder="Add your notes here..." className="mt-1" rows={3} />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <div className="flex justify-between mt-4">
                                <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                                  <ChevronLeft className="w-4 h-4 mr-1" />
                                  Previous
                                </Button>
                                <div className="flex gap-2">
                                  {!showExplanation && selectedAnswer && canCheckAnswer() && (
                                    <Button onClick={() => setShowExplanation(true)}>Check Answer</Button>
                                  )}
                                  <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === shownQuestions.length - 1}>
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Right: Explanation & Discussion (appears only after selecting an answer) */}
                            <div>
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Explanation & Discussion</CardTitle>
                                  <CardDescription>
                                    Detailed reasoning and further notes for this question.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  {!showExplanation ? (
                                    <div className="py-12 text-center text-gray-500">
                                      Select an answer on the left to reveal the explanation and discussion.
                                    </div>
                                  ) : (
                                    <>
                                      <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Explanation</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{currentQuestion?.explanation}</p>
                                      </div>

                                      <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Discussion</h4>
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
                                    </>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ) : (
                          /* Test mode: existing single-panel behavior */
                          <>
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{currentQuestion?.exam}</Badge>
                                <Badge variant="outline">{currentQuestion?.subject}</Badge>
                                {currentQuestion?.topics.map((topic: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)} className={isBookmarked ? "text-blue-600" : ""}>
                                  <Bookmark className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setIsFlagged(!isFlagged)} className={isFlagged ? "text-red-600" : ""}>
                                  <Flag className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Question {currentQuestionIndex + 1} of {shownQuestions.length}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-6 text-gray-800 dark:text-gray-200">{currentQuestion?.question}</p>

                                <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect} className="space-y-3 mb-6">
                                  {currentQuestion?.options.map((option: any) => (
                                    <div key={option.id} className={`flex items-start p-3 rounded-lg border ${selectedAnswer === option.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"} ${showExplanation && option.id === currentQuestion.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""} ${showExplanation && selectedAnswer === option.id && option.id !== currentQuestion.correctAnswer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}`}>
                                      <input type="radio" name="option" value={option.id} checked={selectedAnswer === option.id} onChange={() => handleAnswerSelect(option.id)} className="mt-1" />
                                      <Label htmlFor={option.id} className="ml-3 flex-1 text-gray-800 dark:text-gray-200 cursor-pointer">
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
                                    <Textarea id="notes" value={userNotes} onChange={(e) => setUserNotes(e.target.value)} placeholder="Add your notes here..." className="mt-1" rows={3} />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <div className="flex justify-between">
                              <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                              </Button>
                              <div className="flex gap-2">
                                {!showExplanation && selectedAnswer && canCheckAnswer() && (
                                  <Button onClick={() => setShowExplanation(true)}>Check Answer</Button>
                                )}
                                <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === shownQuestions.length - 1}>
                                  Next
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Qbank;