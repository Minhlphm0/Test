import type { StudentInput } from './student-store';

type ValidationResult =
  | { success: true; data: StudentInput }
  | { success: false; message: string };

type PatchValidationResult =
  | { success: true; data: Partial<StudentInput> }
  | { success: false; message: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRequiredString(body: Record<string, unknown>, key: keyof StudentInput) {
  const value = body[key];
  return typeof value === 'string' ? value.trim() : '';
}

export function validateStudentInput(body: unknown): ValidationResult {
  if (!isObject(body)) {
    return { success: false, message: 'Dữ liệu gửi lên không hợp lệ.' };
  }

  const data: StudentInput = {
    name: readRequiredString(body, 'name'),
    mssv: readRequiredString(body, 'mssv'),
    lop: readRequiredString(body, 'lop'),
  };

  if (!data.name || !data.mssv || !data.lop) {
    return { success: false, message: 'name, mssv và lop là bắt buộc.' };
  }

  return { success: true, data };
}

export function validateStudentPatch(body: unknown): PatchValidationResult {
  if (!isObject(body)) {
    return { success: false, message: 'Dữ liệu gửi lên không hợp lệ.' };
  }

  const data: Partial<StudentInput> = {};

  for (const key of ['name', 'mssv', 'lop'] as const) {
    if (key in body) {
      const value = readRequiredString(body, key);

      if (!value) {
        return { success: false, message: `${key} không được để trống.` };
      }

      data[key] = value;
    }
  }

  if (Object.keys(data).length === 0) {
    return { success: false, message: 'Cần cung cấp ít nhất một trường để cập nhật.' };
  }

  return { success: true, data };
}
