import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "contributions">("profile");
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Dr. John Smith",
    email: "john.smith@example.com",
    specialty: "Cardiology",
    role: "Contributor",
    contributions: 12,
    approved: 8,
    pending: 4
  });

  // Mock user contributions
  const [userContributions, setUserContributions] = useState([
    {
      id: 1,
      question: "A 65-year-old man presents with chest pain and shortness of breath. What is the most likely diagnosis?",
      exam: "MRCP",
      subject: "Cardiology",
      status: "approved",
      date: "2024-01-15"
    },
    {
      id: 2,
      question: "Which of the following is NOT a feature of nephrotic syndrome?",
      exam: "FCPS",
      subject: "Nephrology",
      status: "pending",
      date: "2024-01-20"
    },
    {
      id: 3,
      question: "Management of acute myocardial infarction includes all EXCEPT:",
      exam: "MRCP",
      subject: "Cardiology",
      status: "approved",
      date: "2024-01-10"
    }
  ]);

  const handleDeleteContribution = (id: number) => {
    setUserContributions(prev => prev.filter(q => q.id !== id));
    toast.success("Question deleted successfully!");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
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
      </div>

      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-gray-100">{userData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100">{userData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialty
                </label>
                <p className="text-gray-900 dark:text-gray-100">{userData.specialty}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <p className="text-gray-900 dark:text-gray-100">{userData.role}</p>
              </div>
            </div>
          </div>

          {/* Contribution Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Contribution Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {userData.contributions}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                  {userData.approved}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">Approved</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                  {userData.pending}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-300">Pending</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {Math.round((userData.approved / userData.contributions) * 100)}%
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">Approval Rate</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Contributions Tab */
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Contributions</h2>
          
          {userContributions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No questions submitted yet</p>
              <p className="text-sm">Your submitted questions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userContributions.map((contribution) => (
                <div key={contribution.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
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
                        <span>{contribution.date}</span>
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
                        onClick={() => handleDeleteContribution(contribution.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded ${
                      contribution.status === "approved" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {contribution.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;