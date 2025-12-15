import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import '@/src/i18n';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { HabitsProvider } from '@/src/context/HabitsContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import AuthScreen from '@/src/screens/AuthScreen';
import { Colors } from '@/src/constants';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <AppContent />
      </HabitsProvider>
    </AuthProvider>
  );
}
