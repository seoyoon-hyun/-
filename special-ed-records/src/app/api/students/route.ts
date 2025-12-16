import { NextResponse } from 'next/server';
import { getStudents, addStudent, deleteStudent } from '@/lib/database';

// 학생 목록 조회
export async function GET() {
  try {
    const students = getStudents();
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: '학생 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// 학생 추가
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, grade, disabilityType, notes } = body;

    if (!name) {
      return NextResponse.json({ error: '학생 이름은 필수입니다.' }, { status: 400 });
    }

    const newStudent = addStudent({
      name,
      grade: grade || '',
      disabilityType: disabilityType || '',
      notes: notes || '',
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '학생 추가에 실패했습니다.' }, { status: 500 });
  }
}

// 학생 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '학생 ID가 필요합니다.' }, { status: 400 });
    }

    const success = deleteStudent(id);
    if (!success) {
      return NextResponse.json({ error: '학생을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '학생 삭제에 실패했습니다.' }, { status: 500 });
  }
}
