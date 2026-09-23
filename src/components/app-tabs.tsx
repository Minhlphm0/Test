import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      
      {/* Tab Home */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* Tab Student */}
      <NativeTabs.Trigger name="student">
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/student.png')}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>Danh sách Sinh viên</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}