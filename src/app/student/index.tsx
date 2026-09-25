import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Student {
  id: number;
  name: string;
  mssv: string;
  lop: string;
}

interface StudentsResponse {
  data: Student[];
}

interface StudentResponse {
  data: Student;
}

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [mssv, setMssv] = useState('');
  const [lop, setLop] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadStudents = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/students', { signal });

      if (!response.ok) {
        throw new Error(`API trả về lỗi ${response.status}`);
      }

      const result = (await response.json()) as StudentsResponse;
      setStudents(result.data);
    } catch (requestError) {
      if (signal?.aborted) {
        return;
      }

      setError(requestError instanceof Error ? requestError.message : 'Không thể tải danh sách sinh viên.');
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      void loadStudents(controller.signal);

      return () => controller.abort();
    }, [loadStudents])
  );

  const handleStudentPress = (student: Student) => {
    router.push({
      pathname: '/student/student-detail',
      params: {
        id: String(student.id),
      },
    });
  };

  const handleAddStudent = async () => {
    if (!name.trim() || !mssv.trim() || !lop.trim()) {
      setFormError('Vui lòng nhập đầy đủ họ tên, MSSV và lớp.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          mssv: mssv.trim(),
          lop: lop.trim(),
        }),
      });

      const result = (await response.json()) as StudentResponse | { message?: string };

      if (!response.ok || !('data' in result)) {
        throw new Error('message' in result && result.message ? result.message : 'Không thể thêm sinh viên.');
      }

      setStudents((currentStudents) => [...currentStudents, result.data]);
      setName('');
      setMssv('');
      setLop('');
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Không thể thêm sinh viên.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1F2937" />
        <Text style={styles.message}>Đang tải danh sách sinh viên...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => void loadStudents()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.formTitle}>Thêm sinh viên</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Họ và tên"
          editable={!isSubmitting}
        />
        <TextInput
          style={styles.input}
          value={mssv}
          onChangeText={setMssv}
          placeholder="Mã số sinh viên"
          keyboardType="number-pad"
          editable={!isSubmitting}
        />
        <TextInput
          style={styles.input}
          value={lop}
          onChangeText={setLop}
          placeholder="Lớp"
          editable={!isSubmitting}
        />

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            (pressed || isSubmitting) && styles.addButtonDisabled,
          ]}
          onPress={() => void handleAddStudent()}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>Thêm sinh viên</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.listTitle}>Danh sách sinh viên</Text>
      {students.length === 0 ? (
        <Text style={styles.message}>Chưa có sinh viên.</Text>
      ) : (
        students.map((student) => (
          <Pressable
            key={student.id}
            style={({ pressed }) => [styles.studentItem, pressed && styles.studentItemPressed]}
            onPress={() => handleStudentPress(student)}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentInfo}>MSSV: {student.mssv}</Text>
            <Text style={styles.studentInfo}>Lớp: {student.lop}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    contentContainer: {
        padding: 20,
    },
    form: {
        padding: 16,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 2,
    },
    formTitle: {
        marginBottom: 14,
        color: '#111827',
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        color: '#111827',
        fontSize: 16,
    },
    formError: {
        marginBottom: 12,
        color: '#B91C1C',
        fontSize: 14,
    },
    addButton: {
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderRadius: 6,
    },
    addButtonDisabled: {
        opacity: 0.65,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    listTitle: {
        marginBottom: 12,
        color: '#111827',
        fontSize: 20,
        fontWeight: 'bold',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    message: {
        marginTop: 12,
        color: '#4B5563',
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1F2937',
        borderRadius: 6,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
