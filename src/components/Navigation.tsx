import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { getStoredUser, clearStoredUser } from "../lib/auth";
import { User } from "../lib/types";
import { Brain, Menu, X, User as UserIcon, LogOut } from "lucide-react";

export const Navigation: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-skillpath-bg/95 backdrop-blur-sm border-b border-skillpath-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-skillpath-button-primary">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-skillpath-text-secondary">
              SkillPath AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/how-it-works"
              className="text-skillpath-text-primary hover:text-skillpath-text-secondary transition-colors"
            >
              How it Works
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-skillpath-text-primary hover:text-skillpath-text-secondary transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-skillpath-text-primary">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-skillpath-text-muted hover:text-skillpath-text-primary"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-skillpath-text-primary hover:text-skillpath-text-secondary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-skillpath-text-primary"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-skillpath-surface rounded-lg mt-2 border border-skillpath-border">
              <Link
                to="/how-it-works"
                className="block px-3 py-2 text-skillpath-text-primary hover:text-skillpath-text-secondary transition-colors"
                onClick={closeMenu}
              >
                How it Works
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-skillpath-text-primary hover:text-skillpath-text-secondary transition-colors"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 border-t border-skillpath-border">
                    <div className="flex items-center space-x-2 text-skillpath-text-primary mb-2">
                      <UserIcon className="w-4 h-4" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-skillpath-text-muted hover:text-skillpath-text-primary"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2 border-t border-skillpath-border">
                  <Link to="/login" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-skillpath-text-primary"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
