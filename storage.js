import { kvsIndexedDB } from "./kvs-indexeddb-2.1.1.js"
import { simpleDateFormatter } from "./utils.js"

const storage = await kvsIndexedDB({
  name: "iwsq",
  version: 1,
});

const STUDENT_NO = "studentNo"
const STUDENTS_COUNT = "studentsCount";
const LAST_RUN = "lastRun";

export const setStudentNo = async (no) => {
  await storage.set(STUDENT_NO, no);
}
export const getStudentNo = async () => {
  return await storage.get(STUDENT_NO);
}
export const deleteStudentNo = async () => {
  return await storage.delete(STUDENT_NO);
}

export const getStudentsCount = async () => {
  return await storage.get(STUDENTS_COUNT);
}
export const addStudentsCount = async (count) => {
  const newCount = Number(await getStudentsCount() ?? 0) + count;
  await storage.set(STUDENTS_COUNT, newCount);
}
export const deleteStudentsCount = async () => {
  await storage.set(STUDENTS_COUNT, 0);
}

export const getLastRun = async () => {
  return await storage.get(LAST_RUN);
}
export const updateLastRun = async () => {
  await storage.set(LAST_RUN, simpleDateFormatter.format(new Date()));
}
