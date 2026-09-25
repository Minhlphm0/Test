import { createStudent, getStudents } from '@/server/student-store';
import { validateStudentInput } from '@/server/student-validation';

export function GET() {
  return Response.json({ data: getStudents() });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'JSON không hợp lệ.' }, { status: 400 });
  }

  const result = validateStudentInput(body);

  if (!result.success) {
    return Response.json({ message: result.message }, { status: 400 });
  }

  const student = createStudent(result.data);
  return Response.json({ data: student }, { status: 201 });
}
