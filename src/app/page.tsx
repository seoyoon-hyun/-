'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  disabilityType: string;
  notes: string;
}

interface Record {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  category: string;
  keywords: string[];
  content: string;
  createdAt: string;
}

interface Category {
  name: string;
  keywords: string[];
}

export default function Home() {
  // 상태 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 폼 상태
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('학습');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [customKeywords, setCustomKeywords] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [recordDate, setRecordDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // 학생 추가 폼
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [newStudentDisability, setNewStudentDisability] = useState('');

  // 탭 관리
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    fetchStudents();
    fetchRecords();
    fetchCategories();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('학생 목록 로드 실패:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error('기록 목록 로드 실패:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/generate');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  // 학생 추가
  const handleAddStudent = async () => {
    if (!newStudentName.trim()) {
      alert('학생 이름을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          grade: newStudentGrade,
          disabilityType: newStudentDisability,
        }),
      });

      if (res.ok) {
        setNewStudentName('');
        setNewStudentGrade('');
        setNewStudentDisability('');
        setShowAddStudent(false);
        fetchStudents();
      }
    } catch (error) {
      console.error('학생 추가 실패:', error);
    }
  };

  // 학생 삭제
  const handleDeleteStudent = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (error) {
      console.error('학생 삭제 실패:', error);
    }
  };

  // 키워드 토글
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // 문장 생성
  const handleGenerate = async () => {
    const student = students.find(s => s.id === selectedStudent);
    if (!student) {
      alert('학생을 선택해주세요.');
      return;
    }

    if (selectedKeywords.length === 0 && !customKeywords.trim()) {
      alert('키워드를 선택하거나 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          category: selectedCategory,
          keywords: selectedKeywords,
          customKeywords: customKeywords,
        }),
      });

      const data = await res.json();
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('문장 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 기록 저장
  const handleSaveRecord = async () => {
    const student = students.find(s => s.id === selectedStudent);
    if (!student) {
      alert('학생을 선택해주세요.');
      return;
    }

    if (!generatedContent.trim()) {
      alert('기록 내용이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent,
          studentName: student.name,
          date: recordDate,
          category: selectedCategory,
          keywords: [...selectedKeywords, ...customKeywords.split(/[,\s]+/).filter(k => k)],
          content: generatedContent,
        }),
      });

      if (res.ok) {
        alert('기록이 저장되었습니다!');
        setGeneratedContent('');
        setSelectedKeywords([]);
        setCustomKeywords('');
        fetchRecords();
      }
    } catch (error) {
      console.error('기록 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 기록 삭제
  const handleDeleteRecord = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetch(`/api/records?id=${id}`, { method: 'DELETE' });
      fetchRecords();
    } catch (error) {
      console.error('기록 삭제 실패:', error);
    }
  };

  // 현재 선택된 카테고리의 키워드들
  const currentKeywords = categories.find(c => c.name === selectedCategory)?.keywords || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-900">
            특수교육 누가기록 시스템
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            키워드를 선택하면 자동으로 누가기록이 생성됩니다
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('record')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'record'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            기록 작성
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            기록 조회 ({records.length})
          </button>
        </div>

        {activeTab === 'record' ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* 왼쪽: 학생 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">학생 선택</h2>
                <button
                  onClick={() => setShowAddStudent(!showAddStudent)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {showAddStudent ? '취소' : '+ 추가'}
                </button>
              </div>

              {/* 학생 추가 폼 */}
              {showAddStudent && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="학생 이름 *"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="학년/반 (예: 3-2)"
                    value={newStudentGrade}
                    onChange={e => setNewStudentGrade(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="장애유형"
                    value={newStudentDisability}
                    onChange={e => setNewStudentDisability(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={handleAddStudent}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    학생 등록
                  </button>
                </div>
              )}

              {/* 학생 목록 */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    등록된 학생이 없습니다
                  </p>
                ) : (
                  students.map(student => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${
                        selectedStudent === student.id
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        {student.grade && (
                          <p className="text-xs text-gray-500">{student.grade}</p>
                        )}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteStudent(student.id);
                        }}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* 날짜 선택 */}
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기록 날짜
                </label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={e => setRecordDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* 가운데: 키워드 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                키워드 선택
              </h2>

              {/* 카테고리 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영역 선택
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedKeywords([]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 키워드 버튼들 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  키워드 선택 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentKeywords.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => toggleKeyword(keyword)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedKeywords.includes(keyword)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자유 키워드 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 키워드 (자유 입력)
                </label>
                <input
                  type="text"
                  placeholder="예: 발표, 질문, 도움요청"
                  value={customKeywords}
                  onChange={e => setCustomKeywords(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  쉼표나 공백으로 구분하여 입력
                </p>
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedStudent}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '생성 중...' : '누가기록 문장 생성'}
              </button>
            </div>

            {/* 오른쪽: 생성된 기록 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                생성된 누가기록
              </h2>

              <div className="mb-4">
                <textarea
                  value={generatedContent}
                  onChange={e => setGeneratedContent(e.target.value)}
                  placeholder="키워드를 선택하고 '문장 생성' 버튼을 클릭하세요"
                  className="w-full h-48 px-3 py-2 border rounded-lg text-sm resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  생성된 문장을 직접 수정할 수 있습니다
                </p>
              </div>

              {/* 저장 버튼 */}
              <button
                onClick={handleSaveRecord}
                disabled={isLoading || !generatedContent.trim()}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '저장 중...' : '기록 저장'}
              </button>

              {/* 선택된 정보 요약 */}
              {selectedStudent && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p>
                    <span className="font-medium">학생:</span>{' '}
                    {students.find(s => s.id === selectedStudent)?.name}
                  </p>
                  <p>
                    <span className="font-medium">날짜:</span> {recordDate}
                  </p>
                  <p>
                    <span className="font-medium">영역:</span> {selectedCategory}
                  </p>
                  {selectedKeywords.length > 0 && (
                    <p>
                      <span className="font-medium">키워드:</span>{' '}
                      {selectedKeywords.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 기록 조회 탭 */
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              누가기록 목록
            </h2>

            {records.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                저장된 기록이 없습니다
              </p>
            ) : (
              <div className="space-y-4">
                {records.map(record => (
                  <div
                    key={record.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium mr-2">
                          {record.studentName}
                        </span>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs mr-2">
                          {record.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {record.date}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                    <p className="text-gray-700">{record.content}</p>
                    {record.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {record.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        <p>특수교육 누가기록 시스템 v1.0</p>
      </footer>
    </div>
  );
}
