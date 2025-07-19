import { createContext, useState, useContext, useEffect } from 'react';
import { loginAdmin, logoutAdmin, getCurrentUser, checkAdminPermission } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자 상태 확인
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('사용자 상태 확인 실패:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginAdmin(email, password);
      setUser(result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutAdmin();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const checkAdmin = async () => {
    return await checkAdminPermission();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 