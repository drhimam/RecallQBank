import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Shield } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = {
  _id: string;
  username: string;
  email: string;
  specialty: string;
  role: string;
  contributions: number;
  approved: number;
  pending: number;
};

type Contribution = {
  _id: string;
  question: string;
  exam: string;
  subject: string;
  status: string;
  topics?: string[];
  createdAt: string;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "contributions" | "moderation">("profile");
  const [user, setUser] = useState<User | null>(null);
  const [userContributions, setUserContributions] = useState<Contribution[]>([]);
  const [moderatorData, setModeratorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Simulate fetching user data
    setTimeout(() => {
      const mockUser: User = {
        _id: "1",
        username: "dr_smith",
        email: "dr.smith@example.com",
        specialty: "Cardiology",
        role: "moderator",
        contributions: 15,
        approved: 12,
        pending: 3
      };
      
      const mockContributions: Contribution[] = [
        {
          _id: "1",
          question: "A 65-year-old man presents with chest pain and shortness of breath...",
          exam: "MRCP",
          subject: "Cardiology",
          status: "approved",
          topics: ["Chest Pain", "Acute Coronary Syndrome"],
          createdAt: "2024-01-15"
        },
        {
          _id: "2",
          question: "Which of the following is NOT a feature of nephrotic syndrome?",
          exam: "FCPS",
          subject: "Nephrology",
          status: "pending",
          topics: ["Renal", "Proteinuria"],
          createdAt: "2024-01-20"
        }
      ];

      setUser(mockUser);
      setUserContributions(mockContributions);
    }, 500);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteContribution = (id: string) => {
    setUserContributions(prev => prev.filter(q => q._id !== id));
    toast.success("Question deleted successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const isModerator = user.role === "moderator" || user.role === "admin";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "contributions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("contributions")}
          >
            My Contributions ({userContributions.length})
          </button>
          {isModerator && (
            <button
              className={`px-4 py-2 font-medium flex items-center ${
                activeTab === "moderation"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("moderation")}
            >
              <Shield className="w-4 h-4 mr-1" />
              Moderation
            </button>
          )}
        </div>

        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialty
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.specialty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contribution Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Contribution Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {user.contributions}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                      {user.approved}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">Approved</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                      {user.pending}
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-300">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                      {user.contributions > 0 ? Math.round((user.approved / user.contributions) * 100) : 0}%
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-300">Approval Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === "contributions" ? (
          /* Contributions Tab */
          <Card>
            <CardHeader>
              <CardTitle>My Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading contributions...</div>
              ) : userContributions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No questions submitted yet</p>
                  <p className="text-sm">Your submitted questions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userContributions.map((contribution) => (
                    <div key={contribution._id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {contribution.question}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 space-x-3">
                            <span>{contribution.exam}</span>
                            <span>•</span>
                            <span>{contribution.subject}</span>
                            <span>•</span>
                            <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {/* Navigate to edit */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteContribution(contribution._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded ${
                          contribution.status === "approved" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : contribution.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}>
                          {contribution.status}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {contribution.topics?.slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {contribution.topics?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{contribution.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Moderation Tab - Only visible to moderators */
          isModerator && (
            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-2" />
                  <CardTitle>Moderation Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading moderation data...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Pending Questions</h3>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">24</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Approved</h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-300">156</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 dark:text-red-200">Rejected</h3>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-300">8</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Recent Pending Questions</h3>
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-medium">A 45-year-old female presents with...</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">Submitted 2 hours ago</span>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-medium">Which of the following is a characteristic...</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">Submitted 5 hours ago</span>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;