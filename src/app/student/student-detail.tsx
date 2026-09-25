import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Student {
    id: number;
    name: string;
    mssv: string;
    lop: string;
}

interface ApiResponse {
    data?: Student;
    message?: string;
}

export default function StudentDetailScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [name, setName] = useState('');
    const [mssv, setMssv] = useState('');
    const [lop, setLop] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadStudent = useCallback(async (signal?: AbortSignal) => {
        if (!id) {
            setError('Không có ID sinh viên.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/students/${id}`, { signal });
            const result = (await response.json()) as ApiResponse;

            if (!response.ok || !result.data) {
                throw new Error(result.message ?? 'Không thể tải sinh viên.');
            }

            setName(result.data.name);
            setMssv(result.data.mssv);
            setLop(result.data.lop);
        } catch (requestError) {
            if (!signal?.aborted) {
                setError(requestError instanceof Error ? requestError.message : 'Không thể tải sinh viên.');
            }
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        void loadStudent(controller.signal);
        return () => controller.abort();
    }, [loadStudent]);

    const handleUpdate = async () => {
        if (!id || !name.trim() || !mssv.trim() || !lop.trim()) {
            setError('Vui lòng nhập đầy đủ họ tên, MSSV và lớp.');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), mssv: mssv.trim(), lop: lop.trim() }),
            });
            const result = (await response.json()) as ApiResponse;

            if (!response.ok || !result.data) {
                throw new Error(result.message ?? 'Không thể cập nhật sinh viên.');
            }

            setName(result.data.name);
            setMssv(result.data.mssv);
            setLop(result.data.lop);
            setSuccessMessage('Cập nhật sinh viên thành công.');
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Không thể cập nhật sinh viên.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });

            if (!response.ok) {
                const result = (await response.json()) as ApiResponse;
                throw new Error(result.message ?? 'Không thể xóa sinh viên.');
            }

            router.back();
        } catch (requestError) {
            setShowDeleteConfirm(false);
            setError(requestError instanceof Error ? requestError.message : 'Không thể xóa sinh viên.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Stack.Screen options={{ title: 'Chi tiết sinh viên' }} />
                <ActivityIndicator size="large" color="#1F2937" />
                <Text style={styles.info}>Đang tải thông tin...</Text>
            </View>
        );
    }

    if (error && !name) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Stack.Screen options={{ title: 'Chi tiết sinh viên' }} />
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.saveButton} onPress={() => void loadStudent()}>
                    <Text style={styles.buttonText}>Thử lại</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <Stack.Screen
                options={{
                    title: 'Chi tiết sinh viên',
                }}
            />
            <Text style={styles.title}>Thông tin sinh viên</Text>
            <Text style={styles.info}>ID: {id}</Text>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>MSSV</Text>
            <TextInput style={styles.input} value={mssv} onChangeText={setMssv} keyboardType="number-pad" />
            <Text style={styles.label}>Lớp</Text>
            <TextInput style={styles.input} value={lop} onChangeText={setLop} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <Pressable style={styles.saveButton} onPress={() => void handleUpdate()} disabled={isSaving || isDeleting}>
                {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Lưu thay đổi</Text>}
            </Pressable>

            {showDeleteConfirm ? (
                <View style={styles.confirmBox}>
                    <Text style={styles.errorText}>Bạn có chắc muốn xóa sinh viên này?</Text>
                    <View style={styles.confirmActions}>
                        <Pressable style={styles.cancelButton} onPress={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </Pressable>
                        <Pressable style={styles.deleteButton} onPress={() => void handleDelete()} disabled={isDeleting}>
                            {isDeleting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác nhận xóa</Text>}
                        </Pressable>
                    </View>
                </View>
            ) : (
                <Pressable style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)}>
                    <Text style={styles.buttonText}>Xóa sinh viên</Text>
                </Pressable>
            )}

            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </Pressable>
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    saveButton: {
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#1F2937',
        borderRadius: 6,
    },
    deleteButton: {
        flex: 1,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
        backgroundColor: '#DC2626',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#B91C1C',
        marginBottom: 12,
        textAlign: 'center',
    },
    successText: {
        color: '#15803D',
        marginBottom: 12,
    },
    confirmBox: {
        padding: 14,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 6,
        backgroundColor: '#FEF2F2',
    },
    confirmActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        marginTop: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 6,
    },
    backButtonText: {
        color: '#374151',
        fontSize: 16,
        textAlign: 'center',
    },
});
