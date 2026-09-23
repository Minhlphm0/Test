import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function StudentDetailScreen() {
    const {id,name, mssv, lop} = useLocalSearchParams<
    {id?: string; name?: string; mssv?: string; lop?: string}
    >();
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết sinh viên',
                }}
            />
            <Text style={styles.title}>Thông tin sinh viên</Text>
            <Text style={styles.info}>Họ và tên: {name?? 'Không có thông tin'}</Text>
            <Text style={styles.info}>MSSV: {mssv?? 'Không có thông tin'}</Text>
            <Text style={styles.info}>Lớp: {lop?? 'Không có thông tin'}</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </Pressable>
        </View>
        
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },  
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});