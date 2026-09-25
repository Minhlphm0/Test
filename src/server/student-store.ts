export interface Student {
  id: number;
  name: string;
  mssv: string;
  lop: string;
}

export type StudentInput = Omit<Student, 'id'>;

const initialStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn A', mssv: '123456789', lop: 'CNTT K62' },
  { id: 2, name: 'Trần Thị B', mssv: '987654321', lop: 'CNTT K62' },
  { id: 3, name: 'Lê Văn C', mssv: '456789123', lop: 'CNTT K62' },
];

// Mỗi API route được Metro đóng gói thành một server bundle riêng. Lưu mảng
// trực tiếp trong module sẽ tạo ra nhiều bản sao không đồng bộ. Đặt store trên
// globalThis giúp tất cả route dùng cùng một mảng trong tiến trình dev server.
const serverGlobal = globalThis as typeof globalThis & {
  __studentStore?: Student[];
};

const students = (serverGlobal.__studentStore ??= initialStudents);

export function getStudents() {
  return students;
}

export function getStudentById(id: number) {
  return students.find((student) => student.id === id);
}

export function createStudent(input: StudentInput) {
  const nextId = students.reduce((maxId, student) => Math.max(maxId, student.id), 0) + 1;
  const student: Student = { id: nextId, ...input };

  students.push(student);
  return student;
}

export function updateStudent(id: number, input: StudentInput) {
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return undefined;
  }

  students[index] = { id, ...input };
  return students[index];
}

export function patchStudent(id: number, input: Partial<StudentInput>) {
  const student = getStudentById(id);

  if (!student) {
    return undefined;
  }

  Object.assign(student, input);
  return student;
}

export function deleteStudent(id: number) {
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return false;
  }

  students.splice(index, 1);
  return true;
}
