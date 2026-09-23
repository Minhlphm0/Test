import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Student {
  id: number;
  name: string;
  mssv: number;
  lop: string;
}

export default function StudentListScreen() {
  const students: Student[] = [
    { id: 1, name: 'Nguyễn Văn A', mssv: 123456789, lop: 'CNTT K62' },
    { id: 2, name: 'Trần Thị B', mssv: 987654321, lop: 'CNTT K62' },
    { id: 3, name: 'Lê Văn C', mssv: 456789123, lop: 'CNTT K62' },
  ];
  
const handleStudentPress = (student: Student) => {
    router.push({
      pathname: '/student/student-detail',
      params: {
        id: String(student.id),
        name: student.name,
        mssv: String(student.mssv),
        lop: student.lop,
      },
    });
  }
  return (
    <View style={styles.container}>
      {students.map((student) => (
        <Pressable
          key={student.id}
          style={({ pressed }) => [styles.studentItem, pressed && styles.studentItemPressed]}
          onPress={() => handleStudentPress(student)}
        >
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentInfo}>MSSV: {student.mssv}</Text>
          <Text style={styles.studentInfo}>Lớp: {student.lop}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    studentItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
    },
    studentItemPressed: {
        opacity: 0.7,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    studentInfo: {
        fontSize: 14,
        color: '#666',
    },
});
