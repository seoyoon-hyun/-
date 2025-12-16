// 간단한 JSON 파일 기반 데이터베이스
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

// 타입 정의
export interface Student {
  id: string;
  name: string;
  grade: string;
  disabilityType: string;
  notes: string;
  createdAt: string;
}

export interface Record {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  category: string;
  keywords: string[];
  content: string;
  createdAt: string;
}

// 데이터 디렉토리 확인
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 학생 데이터 읽기
export function getStudents(): Student[] {
  ensureDataDir();
  if (!fs.existsSync(STUDENTS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 학생 데이터 저장
export function saveStudents(students: Student[]) {
  ensureDataDir();
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
}

// 학생 추가
export function addStudent(student: Omit<Student, 'id' | 'createdAt'>): Student {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

// 학생 삭제
export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  saveStudents(filtered);
  return true;
}

// 기록 데이터 읽기
export function getRecords(): Record[] {
  ensureDataDir();
  if (!fs.existsSync(RECORDS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(RECORDS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 기록 데이터 저장
export function saveRecords(records: Record[]) {
  ensureDataDir();
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2));
}

// 기록 추가
export function addRecord(record: Omit<Record, 'id' | 'createdAt'>): Record {
  const records = getRecords();
  const newRecord: Record = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  saveRecords(records);
  return newRecord;
}

// 기록 삭제
export function deleteRecord(id: string): boolean {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) return false;
  saveRecords(filtered);
  return true;
}

// 학생별 기록 조회
export function getRecordsByStudent(studentId: string): Record[] {
  const records = getRecords();
  return records.filter(r => r.studentId === studentId);
}

// 날짜별 기록 조회
export function getRecordsByDate(date: string): Record[] {
  const records = getRecords();
  return records.filter(r => r.date === date);
}
