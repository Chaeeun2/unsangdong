import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../lib/firebase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth의 onAuthStateChanged를 직접 사용
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user 객체를 직접 전달 (UserImpl)
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.signIn(email, password);
      if (result.success) {
        setUser(result.user);
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 