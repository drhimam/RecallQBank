import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        if (isLogin) {
          // Save token to localStorage
          localStorage.setItem("token", "fake-jwt-token");
          toast.success("Login successful!");
          navigate("/profile");
        } else {
          toast.success("Registration successful! Please log in.");
          setIsLogin(true);
          setUsername("");
          setSpecialty("");
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Auth error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 flex-1">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Access your account to contribute and study" 
                  : "Create an account to contribute questions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : (isLogin ? "Login" : "Register")}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Register" 
                    : "Already have an account? Login"}
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/" className="text-blue-600 hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;