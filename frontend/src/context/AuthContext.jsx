import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set auth header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Fetch current user on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    return userData;
  };

  // Register handler
  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    const { token: authToken, user: registeredUser } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(registeredUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    return registeredUser;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update profile
  const updateProfile = async (profileData) => {
    const res = await axios.put('/api/auth/profile', profileData);
    setUser(res.data.user);
    return res.data;
  };

  // Toggle Save / Favorite Property
  const toggleSaveProperty = async (propertyId) => {
    if (!user) return { requireAuth: true };
    try {
      const res = await axios.post(`/api/properties/${propertyId}/save`);
      const isSaved = res.data.saved;
      setUser(prev => {
        if (!prev) return prev;
        const currentSaved = Array.isArray(prev.savedProperties) ? prev.savedProperties : [];
        const updatedSaved = isSaved
          ? [...currentSaved, propertyId]
          : currentSaved.filter(id => (typeof id === 'string' ? id : id._id || id) !== propertyId);
        return { ...prev, savedProperties: updatedSaved };
      });
      return res.data;
    } catch (error) {
      console.error('Error toggling save property:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      toggleSaveProperty,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isAgent: user?.role === 'agent' || user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
