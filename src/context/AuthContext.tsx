import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
}

interface SearchHistoryItem {
  from: string;
  to: string;
  timestamp: number;
}

interface SecurityQuestion {
  id: number;
  question: string;
}

interface SecurityAnswer {
  questionId: number;
  answer: string;
}

interface RegisteredUser {
  username: string;
  password: string;
  securityAnswers: SecurityAnswer[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, securityAnswers: SecurityAnswer[]) => boolean;
  logout: () => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (from: string, to: string) => void;
  getSecurityQuestions: () => SecurityQuestion[];
  getUserSecurityQuestions: (username: string) => SecurityQuestion[] | null;
  verifySecurityAnswers: (username: string, answers: SecurityAnswer[]) => boolean;
  resetPassword: (username: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security questions
const SECURITY_QUESTIONS: SecurityQuestion[] = [
  { id: 1, question: "What was the name of your primary school?" },
  { id: 2, question: "What is your nickname?" },
  { id: 3, question: "What was the name of your favorite movie or book?" },
  { id: 4, question: "In which city were you born?" },
  { id: 5, question: "What is your favorite high school teacher's name?" },
  { id: 6, question: "What is your favorite sport or activity?" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  const getSecurityQuestions = () => {
    return SECURITY_QUESTIONS;
  };

  const register = (username: string, password: string, securityAnswers: SecurityAnswer[]) => {
    if (registeredUsers.some(u => u.username === username)) {
      return false;
    }
    setRegisteredUsers([...registeredUsers, { username, password, securityAnswers }]);
    return true;
  };

  const login = (username: string, password: string) => {
    const foundUser = registeredUsers.find(
      u => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser({ username: foundUser.username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSearchHistory([]);
  };

  const addSearchHistory = (from: string, to: string) => {
    setSearchHistory(prev => [
      { from, to, timestamp: Date.now() },
      ...prev.slice(0, 4) // Keep only last 5 searches
    ]);
  };

  const getUserSecurityQuestions = (username: string): SecurityQuestion[] | null => {
    const foundUser = registeredUsers.find(u => u.username === username);
    if (!foundUser) {
      return null;
    }
    return foundUser.securityAnswers.map(sa => 
      SECURITY_QUESTIONS.find(q => q.id === sa.questionId)!
    );
  };

  const verifySecurityAnswers = (username: string, answers: SecurityAnswer[]): boolean => {
    const foundUser = registeredUsers.find(u => u.username === username);
    if (!foundUser) {
      return false;
    }
    
    // Check if all answers match (case-insensitive)
    return answers.every(answer => {
      const userAnswer = foundUser.securityAnswers.find(sa => sa.questionId === answer.questionId);
      return userAnswer && userAnswer.answer.toLowerCase().trim() === answer.answer.toLowerCase().trim();
    });
  };

  const resetPassword = (username: string, newPassword: string): boolean => {
    const userIndex = registeredUsers.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return false;
    }
    
    const updatedUsers = [...registeredUsers];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
    setRegisteredUsers(updatedUsers);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      searchHistory, 
      addSearchHistory,
      getSecurityQuestions,
      getUserSecurityQuestions,
      verifySecurityAnswers,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}