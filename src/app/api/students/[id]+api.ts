import {
  deleteStudent,
  getStudentById,
  patchStudent,
  updateStudent,
} from '@/server/student-store';
import { validateStudentInput, validateStudentPatch } from '@/server/student-validation';

type RouteParams = { id: string };

function readId(params: RouteParams) {
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function invalidIdResponse() {
  return Response.json({ message: 'ID sinh viên không hợp lệ.' }, { status: 400 });
}

function notFoundResponse() {
  return Response.json({ message: 'Không tìm thấy sinh viên.' }, { status: 404 });
}

async function readJson(request: Request) {
  try {
    return { success: true as const, data: (await request.json()) as unknown };
  } catch {
    return { success: false as const };
  }
}

export function GET(_request: Request, params: RouteParams) {
  const id = readId(params);

  if (!id) {
    return invalidIdResponse();
  }

  const student = getStudentById(id);
  return student ? Response.json({ data: student }) : notFoundResponse();
}

export async function PUT(request: Request, params: RouteParams) {
  const id = readId(params);

  if (!id) {
    return invalidIdResponse();
  }

  const body = await readJson(request);

  if (!body.success) {
    return Response.json({ message: 'JSON không hợp lệ.' }, { status: 400 });
  }

  const result = validateStudentInput(body.data);

  if (!result.success) {
    return Response.json({ message: result.message }, { status: 400 });
  }

  const student = updateStudent(id, result.data);
  return student ? Response.json({ data: student }) : notFoundResponse();
}

export async function PATCH(request: Request, params: RouteParams) {
  const id = readId(params);

  if (!id) {
    return invalidIdResponse();
  }

  const body = await readJson(request);

  if (!body.success) {
    return Response.json({ message: 'JSON không hợp lệ.' }, { status: 400 });
  }

  const result = validateStudentPatch(body.data);

  if (!result.success) {
    return Response.json({ message: result.message }, { status: 400 });
  }

  const student = patchStudent(id, result.data);
  return student ? Response.json({ data: student }) : notFoundResponse();
}

export function DELETE(_request: Request, params: RouteParams) {
  const id = readId(params);

  if (!id) {
    return invalidIdResponse();
  }

  return deleteStudent(id)
    ? new Response(null, { status: 204 })
    : notFoundResponse();
}
