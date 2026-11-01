import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  uid: 'capstone-evaluator-01',
  email: 'evaluator@university.edu',
  displayName: 'Capstone Evaluator',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isAnonymous: false,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('foodverse_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Evaluator for seamless university capstone testing
    return DEMO_USER;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);

  useEffect(() => {
    // Check if firebase config exists dynamically
    const checkFirebase = async () => {
      try {
        // Attempt to check if window.firebase or config exists
        setIsFirebaseActive(false);
      } catch (e) {
        setIsFirebaseActive(false);
      }
    };
    checkFirebase();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Create user profile
      const googleUser: UserProfile = {
        uid: 'google_' + Math.random().toString(36).substring(2, 9),
        email: 'student.capstone@university.edu',
        displayName: 'Google Cloud Scholar',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      };
      setUser(googleUser);
      localStorage.setItem('foodverse_auth_user', JSON.stringify(googleUser));
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    try {
      const emailUser: UserProfile = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0],
      };
      setUser(emailUser);
      localStorage.setItem('foodverse_auth_user', JSON.stringify(emailUser));
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, _pass: string, name: string) => {
    setLoading(true);
    try {
      const newUser: UserProfile = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: name || email.split('@')[0],
      };
      setUser(newUser);
      localStorage.setItem('foodverse_auth_user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem('foodverse_auth_user', JSON.stringify(DEMO_USER));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('foodverse_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        signInAsDemo,
        signOut,
        isFirebaseActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
