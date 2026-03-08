import React, { createContext, useContext, useState, useEffect } from 'react';
import { View } from 'react-native';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedEmail = await AsyncStorage.getItem('userEmail');

      if (storedToken && storedEmail) {
        setUser({
          email: storedEmail,
          token: storedToken,
        });
      }
    };

    checkUserStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userEmail');
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </View>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};