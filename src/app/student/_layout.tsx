import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1F2937',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="index" options={{ title: 'Danh sách sinh viên' }} />
      <Stack.Screen name="student-detail" options={{ title: 'Chi tiết sinh viên' }} />
    </Stack>
  );
}
