import { NextResponse } from 'next/server';
import { getRecords, addRecord, deleteRecord, getRecordsByStudent, getRecordsByDate } from '@/lib/database';

// 기록 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');

    let records;

    if (studentId) {
      records = getRecordsByStudent(studentId);
    } else if (date) {
      records = getRecordsByDate(date);
    } else {
      records = getRecords();
    }

    // 최신순 정렬
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: '기록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// 기록 추가
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, studentName, date, category, keywords, content } = body;

    if (!studentId || !content) {
      return NextResponse.json({ error: '학생과 기록 내용은 필수입니다.' }, { status: 400 });
    }

    const newRecord = addRecord({
      studentId,
      studentName: studentName || '',
      date: date || new Date().toISOString().split('T')[0],
      category: category || '기타',
      keywords: keywords || [],
      content,
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '기록 추가에 실패했습니다.' }, { status: 500 });
  }
}

// 기록 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '기록 ID가 필요합니다.' }, { status: 400 });
    }

    const success = deleteRecord(id);
    if (!success) {
      return NextResponse.json({ error: '기록을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '기록 삭제에 실패했습니다.' }, { status: 500 });
  }
}
