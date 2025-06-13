import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Brain, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { loginUser, getUserData } from "../lib/api";
import { setStoredUser } from "../lib/auth";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginUser(formData.email, formData.password);
      if (user) {
        // Get complete user data to check quiz completion status
        const completeUserData = await getUserData(user.email);
        if (completeUserData) {
          setStoredUser(completeUserData);

          // Redirect based on quiz completion
          if (completeUserData.quiz_completed) {
            navigate("/dashboard");
          } else {
            navigate("/quiz");
          }
        } else {
          setError("Unable to load user data");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setFormData({ email, password: "demo" });
    setError("");
    setIsLoading(true);

    try {
      const user = await loginUser(email, "demo");
      if (user) {
        // Get complete user data to check quiz completion status
        const completeUserData = await getUserData(user.email);
        if (completeUserData) {
          setStoredUser(completeUserData);

          // Redirect based on quiz completion
          if (completeUserData.quiz_completed) {
            navigate("/dashboard");
          } else {
            navigate("/quiz");
          }
        }
      }
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-skillpath-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 mb-8 text-skillpath-text-muted hover:text-skillpath-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-skillpath-button-primary">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-skillpath-text-secondary">
              SkillPath AI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-skillpath-text-secondary mb-2">
            Welcome Back
          </h1>
          <p className="text-skillpath-text-muted">
            Continue your journey to your perfect tech career
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-skillpath-surface border-skillpath-border">
          <CardHeader>
            <CardTitle className="text-center text-skillpath-text-secondary">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-skillpath-text-primary flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-skillpath-bg border-skillpath-border text-skillpath-text-primary focus:border-purple-500"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-skillpath-text-primary flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-skillpath-bg border-skillpath-border text-skillpath-text-primary focus:border-purple-500"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6">
              <div className="text-center text-sm text-skillpath-text-muted mb-3">
                Try Demo Accounts
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-skillpath-border text-skillpath-text-muted hover:bg-skillpath-bg hover:border-purple-500"
                  onClick={() => handleDemoLogin("alice@example.com")}
                  disabled={isLoading}
                >
                  Demo: Alice (Completed Quiz → Dashboard)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-skillpath-border text-skillpath-text-muted hover:bg-skillpath-bg hover:border-purple-500"
                  onClick={() => handleDemoLogin("charlie@example.com")}
                  disabled={isLoading}
                >
                  Demo: Charlie (New User → Quiz)
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-skillpath-text-muted text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-skillpath-text-muted">
            Secure sign-in powered by SkillPath AI
          </p>
        </div>
      </div>
    </div>
  );
}
