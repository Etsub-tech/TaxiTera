import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
}

interface SearchHistoryItem {
  from: string;
  to: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (from: string, to: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<{ username: string; password: string }[]>([]);

  const register = (username: string, password: string) => {
    if (registeredUsers.some(u => u.username === username)) {
      return false;
    }
    setRegisteredUsers([...registeredUsers, { username, password }]);
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, searchHistory, addSearchHistory }}>
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
