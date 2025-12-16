import { NextResponse } from 'next/server';
import { generateSentence, generateCustomSentence, CATEGORIES, getKeywordsByCategory } from '@/lib/recordGenerator';

// 카테고리와 키워드 목록 조회
export async function GET() {
  try {
    const categoriesWithKeywords = CATEGORIES.map(category => ({
      name: category,
      keywords: getKeywordsByCategory(category),
    }));

    return NextResponse.json(categoriesWithKeywords);
  } catch (error) {
    return NextResponse.json({ error: '카테고리 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// 문장 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, category, keywords, customKeywords } = body;

    if (!studentName) {
      return NextResponse.json({ error: '학생 이름은 필수입니다.' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: '카테고리는 필수입니다.' }, { status: 400 });
    }

    let generatedContent = '';

    // 템플릿 키워드로 생성
    if (keywords && keywords.length > 0) {
      generatedContent = generateSentence(studentName, category, keywords);
    }

    // 커스텀 키워드로 추가 생성
    if (customKeywords && customKeywords.trim()) {
      const customSentence = generateCustomSentence(studentName, category, customKeywords);
      if (generatedContent) {
        generatedContent += ' ' + customSentence;
      } else {
        generatedContent = customSentence;
      }
    }

    if (!generatedContent) {
      generatedContent = `${studentName}의 ${category} 영역을 관찰하였다.`;
    }

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    return NextResponse.json({ error: '문장 생성에 실패했습니다.' }, { status: 500 });
  }
}
