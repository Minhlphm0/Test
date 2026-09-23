import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

// 1. KIỂU DỮ LIỆU CỦA MỘT CUỐN SÁCH
interface Sach {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'active' | 'inactive';
}

// 2. DỮ LIỆU BAN ĐẦU
// Cả 6 cuốn đều có trạng thái mặc định là active.
const sachBanDau: Sach[] = [
  {
    id: 1,
    title: 'Lập trình C',
    author: 'Nguyễn Văn A',
    category: 'Lập trình',
    status: 'active',
  },
  {
    id: 2,
    title: 'Lập trình Java',
    author: 'Trần Văn B',
    category: 'Lập trình',
    status: 'active',
  },
  {
    id: 3,
    title: 'React Native cơ bản',
    author: 'Lê Văn C',
    category: 'Di động',
    status: 'active',
  },
  {
    id: 4,
    title: 'Cơ sở dữ liệu',
    author: 'Phạm Văn D',
    category: 'Cơ sở dữ liệu',
    status: 'active',
  },
  {
    id: 5,
    title: 'Mạng máy tính',
    author: 'Hoàng Văn E',
    category: 'Mạng',
    status: 'active',
  },
  {
    id: 6,
    title: 'Cấu trúc dữ liệu',
    author: 'Nguyễn Văn F',
    category: 'Lập trình',
    status: 'active',
  },
];

// 3. PROPS CỦA COMPONENT THẺ SÁCH
interface TheSachProps {
  sach: Sach;

  // Dấu ? nghĩa là prop này không bắt buộc.
  // Danh sách quản lí truyền hàm này để cho phép đổi trạng thái.
  // Danh sách hiển thị không truyền nên không đổi được trạng thái.
  onDoiTrangThai?: (id: number) => void;
}

// 4. COMPONENT THẺ SÁCH CÓ THỂ TÁI SỬ DỤNG
// Một component được dùng cho mọi cuốn sách ở cả hai danh sách.
function TheSach(props: TheSachProps) {
  const dangActive = props.sach.status === 'active';

  const handlePress = () => {
    // Nếu component cha có truyền hàm thì gọi hàm đó.
    if (props.onDoiTrangThai) {
      // Gửi id để cha biết cần đổi đúng cuốn sách nào.
      props.onDoiTrangThai(props.sach.id);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookTitle}>
          {props.sach.title}
        </Text>

        <Pressable
          onPress={handlePress}
          // Chỉ danh sách quản lí mới bấm đổi trạng thái được.
          disabled={!props.onDoiTrangThai}
          style={[
            styles.statusButton,
            dangActive ? styles.activeButton : styles.inactiveButton,
          ]}
        >
          <Text style={styles.statusText}>
            {props.sach.status}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.info}>
        Tác giả: <Text style={styles.value}>{props.sach.author}</Text>
      </Text>

      <Text style={styles.info}>
        Thể loại: <Text style={styles.value}>{props.sach.category}</Text>
      </Text>

      <Text style={styles.bookId}>Mã sách: {props.sach.id}</Text>
    </View>
  );
}

// 5. PROPS CỦA COMPONENT DANH SÁCH
interface DanhSachSachProps {
  tieuDe: string;
  moTa: string;
  danhSach: Sach[];
  onDoiTrangThai?: (id: number) => void;
}

// Component danh sách cũng được tái sử dụng:
// dùng một lần cho quản lí và một lần cho hiển thị.
function DanhSachSach(props: DanhSachSachProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {props.tieuDe} ({props.danhSach.length})
      </Text>

      <Text style={styles.description}>{props.moTa}</Text>

      {props.danhSach.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Chưa có sách đang active.
          </Text>
        </View>
      ) : (
        // map tạo một thẻ cho mỗi cuốn sách trong danh sách.
        props.danhSach.map((sach) => (
          <TheSach
            key={sach.id}
            sach={sach}
            onDoiTrangThai={props.onDoiTrangThai}
          />
        ))
      )}
    </View>
  );
}

// 6. MÀN HÌNH CHÍNH
export default function HomeScreen() {
  // State chứa danh sách quản lí đủ 6 cuốn.
  // Mỗi cuốn có status riêng, được phân biệt bằng id.
  const [danhSachQuanLi, setDanhSachQuanLi] =
    useState<Sach[]>(sachBanDau);

  // Đổi trạng thái của đúng cuốn sách được bấm.
  const doiTrangThaiSach = (id: number) => {
    setDanhSachQuanLi((danhSachCu) =>
      danhSachCu.map((sach): Sach => {
        // Không trùng id: giữ nguyên cuốn sách.
        if (sach.id !== id) {
          return sach;
        }

        // Trùng id: tạo bản cập nhật của cuốn sách đó.
        // ...sach giữ lại id, title, author và category.
        return {
          ...sach,
          status: sach.status === 'active' ? 'inactive' : 'active',
        };
      })
    );
  };

  // Danh sách hiển thị được lọc từ danh sách quản lí.
  // Không cần tạo state thứ hai hoặc dùng useEffect để đồng bộ.
  // Khi state thay đổi, màn hình render lại và lọc lại danh sách.
  const danhSachHienThi = danhSachQuanLi.filter(
    (sach) => sach.status === 'active'
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.screenTitle}>QUẢN LÍ SÁCH</Text>

      {/* Có truyền hàm đổi trạng thái → được phép chỉnh */}
      <DanhSachSach
        tieuDe="1. Danh sách quản lí"
        moTa="Bấm nút trạng thái để bật hoặc ẩn từng cuốn sách."
        danhSach={danhSachQuanLi}
        onDoiTrangThai={doiTrangThaiSach}
      />

      {/* Không truyền hàm đổi trạng thái → chỉ xem */}
      <DanhSachSach
        tieuDe="2. Danh sách hiển thị"
        moTa="Chỉ hiển thị những cuốn sách đang active."
        danhSach={danhSachHienThi}
      />
    </ScrollView>
  );
}

// 7. ĐỊNH DẠNG GIAO DIỆN
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Tiêu đề và nút nằm cùng một hàng, không đè lên nhau.
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  bookTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  statusButton: {
    minWidth: 84,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeButton: {
    backgroundColor: '#15803D',
  },

  inactiveButton: {
    backgroundColor: '#64748B',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  info: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },

  value: {
    fontWeight: 'normal',
  },

  bookId: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  emptyBox: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});