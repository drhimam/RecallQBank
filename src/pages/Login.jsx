import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      // Login
      const result = await login({ email, password });
      if (result.success) {
        toast.success('Login successful!');
        navigate('/profile');
      } else {
        toast.error(result.message);
      }
    } else {
      // Register
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, specialty }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          toast.success('Registration successful! Please log in.');
          setIsLogin(true);
          setUsername('');
          setSpecialty('');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } catch (error) {
        toast.error('An error occurred during registration');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 flex-1">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Access your account to contribute and study' 
                  : 'Create an account to contribute questions'}
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
                  {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
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