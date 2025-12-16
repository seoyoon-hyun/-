// 누가기록 자동 생성 시스템
// 키워드를 입력하면 간결한 문장으로 변환

// 카테고리별 키워드 템플릿
const TEMPLATES: { [category: string]: { [keyword: string]: string[] } } = {
  학습: {
    // 긍정적 키워드
    집중: [
      '{name}(이)가 수업 시간에 집중하여 학습에 참여하였다.',
      '{name}(이)가 주어진 과제에 집중하여 완수하였다.',
    ],
    향상: [
      '{name}의 학습 능력이 이전보다 향상되었다.',
      '{name}(이)가 학습 목표를 달성하며 향상된 모습을 보였다.',
    ],
    참여: [
      '{name}(이)가 수업 활동에 적극적으로 참여하였다.',
      '{name}(이)가 모둠 활동에 참여하여 협력하였다.',
    ],
    이해: [
      '{name}(이)가 학습 내용을 이해하고 적용하였다.',
      '{name}(이)가 설명을 듣고 이해한 것을 표현하였다.',
    ],
    완수: [
      '{name}(이)가 주어진 과제를 끝까지 완수하였다.',
      '{name}(이)가 학습 활동을 성실히 완수하였다.',
    ],
    // 지원 필요 키워드
    어려움: [
      '{name}(이)가 학습 내용 이해에 어려움을 보여 개별 지원이 필요하다.',
      '{name}(이)가 과제 수행에 어려움을 나타내어 단계별 안내가 필요하다.',
    ],
    산만: [
      '{name}(이)가 주의집중에 어려움을 보여 개별 촉진이 필요하였다.',
      '{name}(이)가 산만한 모습을 보여 자리 배치 조정이 필요하다.',
    ],
  },
  행동: {
    // 긍정적 키워드
    차분: [
      '{name}(이)가 차분하게 활동에 참여하였다.',
      '{name}(이)가 안정적인 모습으로 하루를 보냈다.',
    ],
    규칙준수: [
      '{name}(이)가 교실 규칙을 잘 지키며 생활하였다.',
      '{name}(이)가 일과 시간을 잘 지켰다.',
    ],
    자기조절: [
      '{name}(이)가 감정을 스스로 조절하는 모습을 보였다.',
      '{name}(이)가 자기 조절 전략을 사용하여 안정을 찾았다.',
    ],
    개선: [
      '{name}의 행동이 이전보다 개선된 모습을 보였다.',
      '{name}(이)가 문제 행동이 감소하는 긍정적 변화를 보였다.',
    ],
    // 지원 필요 키워드
    충동: [
      '{name}(이)가 충동적인 행동을 보여 중재가 필요하였다.',
      '{name}(이)가 기다리기 어려워하여 시각적 지원이 필요하다.',
    ],
    공격: [
      '{name}(이)가 또래에게 공격적 행동을 보여 즉각적인 중재가 이루어졌다.',
      '{name}(이)가 물건을 던지는 행동을 보여 안전 지도가 필요하다.',
    ],
    이탈: [
      '{name}(이)가 자리 이탈 행동을 보여 개별 지원이 필요하였다.',
      '{name}(이)가 활동 중 이탈하여 다시 참여하도록 안내하였다.',
    ],
  },
  사회성: {
    협력: [
      '{name}(이)가 친구와 협력하여 활동을 완수하였다.',
      '{name}(이)가 모둠 활동에서 역할을 나누어 협력하였다.',
    ],
    대화: [
      '{name}(이)가 친구와 적절하게 대화를 나누었다.',
      '{name}(이)가 대화 중 차례를 지키며 소통하였다.',
    ],
    배려: [
      '{name}(이)가 친구를 배려하는 모습을 보였다.',
      '{name}(이)가 어려운 친구를 도와주었다.',
    ],
    인사: [
      '{name}(이)가 교사와 친구들에게 적절하게 인사하였다.',
      '{name}(이)가 먼저 인사하는 긍정적인 모습을 보였다.',
    ],
    갈등: [
      '{name}(이)가 또래와의 갈등 상황에서 중재가 필요하였다.',
      '{name}(이)가 친구와의 관계에서 어려움을 보여 사회성 지도가 필요하다.',
    ],
    위축: [
      '{name}(이)가 또래 상호작용에 위축된 모습을 보였다.',
      '{name}(이)가 혼자 있으려 하여 또래 연결 지원이 필요하다.',
    ],
  },
  자립생활: {
    정리정돈: [
      '{name}(이)가 자신의 물건을 스스로 정리하였다.',
      '{name}(이)가 사용한 학용품을 제자리에 정돈하였다.',
    ],
    식사: [
      '{name}(이)가 급식 시간에 바른 자세로 식사하였다.',
      '{name}(이)가 스스로 식사를 마치고 정리하였다.',
    ],
    위생: [
      '{name}(이)가 손 씻기 등 위생 습관을 잘 실천하였다.',
      '{name}(이)가 화장실 사용 후 손을 깨끗이 씻었다.',
    ],
    이동: [
      '{name}(이)가 교실 이동 시 줄을 서서 안전하게 이동하였다.',
      '{name}(이)가 독립적으로 특별실까지 이동하였다.',
    ],
    착탈의: [
      '{name}(이)가 스스로 겉옷을 입고 벗었다.',
      '{name}(이)가 체육복으로 갈아입기를 독립적으로 수행하였다.',
    ],
    도움필요: [
      '{name}(이)가 일상생활 기술 수행에 부분적 도움이 필요하다.',
      '{name}(이)가 자립 기술 습득을 위한 반복 연습이 필요하다.',
    ],
  },
  의사소통: {
    표현: [
      '{name}(이)가 자신의 의사를 적절하게 표현하였다.',
      '{name}(이)가 원하는 것을 말로 요청하였다.',
    ],
    이해: [
      '{name}(이)가 교사의 지시를 이해하고 따랐다.',
      '{name}(이)가 2단계 지시를 이해하고 수행하였다.',
    ],
    AAC: [
      '{name}(이)가 AAC 도구를 사용하여 의사소통하였다.',
      '{name}(이)가 그림 카드를 선택하여 의사를 표현하였다.',
    ],
    발화: [
      '{name}의 발화가 증가하는 모습을 보였다.',
      '{name}(이)가 새로운 어휘를 사용하여 말하였다.',
    ],
    어려움표현: [
      '{name}(이)가 의사 표현에 어려움을 보여 대체 수단이 필요하다.',
      '{name}(이)가 요구 표현이 어려워 시각적 지원을 제공하였다.',
    ],
  },
};

// 모든 카테고리 목록
export const CATEGORIES = Object.keys(TEMPLATES);

// 카테고리별 키워드 목록
export function getKeywordsByCategory(category: string): string[] {
  return Object.keys(TEMPLATES[category] || {});
}

// 모든 키워드 목록 (카테고리 포함)
export function getAllKeywords(): { category: string; keyword: string }[] {
  const result: { category: string; keyword: string }[] = [];
  for (const category of CATEGORIES) {
    for (const keyword of Object.keys(TEMPLATES[category])) {
      result.push({ category, keyword });
    }
  }
  return result;
}

// 키워드로 문장 생성
export function generateSentence(
  studentName: string,
  category: string,
  keywords: string[]
): string {
  const sentences: string[] = [];

  for (const keyword of keywords) {
    const categoryTemplates = TEMPLATES[category];
    if (categoryTemplates && categoryTemplates[keyword]) {
      const templates = categoryTemplates[keyword];
      // 랜덤하게 하나 선택
      const template = templates[Math.floor(Math.random() * templates.length)];
      // 학생 이름 치환
      const sentence = template.replace(/{name}/g, studentName);
      sentences.push(sentence);
    }
  }

  // 문장들을 자연스럽게 연결
  if (sentences.length === 0) {
    return `${studentName}의 활동을 관찰하였다.`;
  }

  return sentences.join(' ');
}

// 자유 키워드로 문장 생성 (템플릿에 없는 키워드)
export function generateCustomSentence(
  studentName: string,
  category: string,
  customKeywords: string
): string {
  const keywords = customKeywords.split(/[,\s]+/).filter(k => k.trim());

  if (keywords.length === 0) {
    return `${studentName}의 ${category} 영역을 관찰하였다.`;
  }

  // 간단한 문장 생성
  const keywordText = keywords.join(', ');
  return `${studentName}(이)가 ${category} 영역에서 ${keywordText}의 모습을 보였다.`;
}
