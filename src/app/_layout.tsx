import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="student"
          options={{
            title: 'Student',
            tabBarLabel: 'Student',
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
