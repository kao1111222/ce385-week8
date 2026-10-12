// src/services/student.service.ts

import { prisma } from "../lib/prisma.js";
import { notFound } from "../errors/app-error.js";
import type {
  CreateStudentInput,
  ListStudentsQuery,
  UpdateStudentInput,
} from "../schemas/student.schema.js";

// R: อ่านนักศึกษาหลายรายการ
export async function listStudents(query: ListStudentsQuery) {
  const { page, limit, q, sort, order } = query;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { code: { contains: q } },
        ],
      }
    : {};

  const [rows, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    data: rows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// R: อ่านนักศึกษารายคน
export async function getStudentById(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) {
    throw notFound(`ไม่พบนักศึกษา id ${id}`);
  }

  return student;
}

// C: สร้างนักศึกษา
export async function createStudent(input: CreateStudentInput) {
  return prisma.student.create({
    data: input,
  });
}

// ฟังก์ชันตัดค่า undefined
function removeUndefined<T extends Record<string, unknown>>(
  input: T
): { [K in keyof T]?: Exclude<T[K], undefined> } {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as { [K in keyof T]?: Exclude<T[K], undefined> };
}

// U: แก้ไขนักศึกษา
export async function updateStudent(
  id: string,
  input: UpdateStudentInput
) {
  return prisma.student.update({
    where: { id },
    data: removeUndefined(input),
  });
}

// D: ลบนักศึกษา
export async function deleteStudent(id: string) {
  await prisma.student.delete({
    where: { id },
  });
}