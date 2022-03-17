let storage = null;

const initStorage = async () => {
  if (!storage) {
    storage = await kvsIndexedDB({
      name: "iwsq",
      version: 1,
    });
  }

  return storage;
}

const STUDENT_NO = "studentNo"
const STUDENTS_COUNT = "studentsCount";
const LAST_RUN = "lastRun";

const setStudentNo = async (no) => {
  await storage.set(STUDENT_NO, no);
}
const getStudentNo = async () => {
  return await storage.get(STUDENT_NO);
}
const deleteStudentNo = async () => {
  return await storage.delete(STUDENT_NO);
}

const getStudentsCount = async () => {
  return await storage.get(STUDENTS_COUNT);
}
const addStudentsCount = async (count) => {
  const newCount = Number(await getStudentsCount() ?? 0) + count;
  await storage.set(STUDENTS_COUNT, newCount);
}
const deleteStudentsCount = async () => {
  await storage.set(STUDENTS_COUNT, 0);
}

const getLastRun = async () => {
  return await storage.get(LAST_RUN);
}
const updateLastRun = async () => {
  await storage.set(LAST_RUN, simpleDateFormatter.format(new Date()));
}
