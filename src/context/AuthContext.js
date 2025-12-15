// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AuthContext = createContext();

const USER_KEY = 'momentumflow_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверить сохраненного пользователя при запуске
  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      // Проверить доступность Apple Authentication
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Authentication is only available on iOS');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Создать объект пользователя
      const userData = {
        id: credential.user,
        email: credential.email,
        fullName: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : null,
        authToken: credential.identityToken,
      };

      // Сохранить в SecureStore
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.error('Error signing in with Apple:', error);
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signInWithApple,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
