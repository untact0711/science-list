import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, CheckCircle2, Image as ImageIcon, Loader2, AlertCircle, ClipboardPaste, FileText, HelpCircle, Key } from 'lucide-react';

// --- 2022 개정 과학교구 설비 기준 내장 데이터베이스 ---
const STANDARD_EQUIPMENT = [
  { category: "공통-측정교구", name: "전자저울", spec: "칭량 100~500 g, 감량 0.1 g", requirement: "4학생당 1", type: "필수", keywords: ["전자저울", "저울"] },
  { category: "공통-측정교구", name: "디지털 온도계", spec: "접촉식, 온도범위 약 -40~200 ℃", requirement: "4학생당 1", type: "필수", keywords: ["디지털 온도계", "디지털온도계"] },
  { category: "공통-측정교구", name: "센서(온도)", spec: "온도 범위 약 -40~125 ℃, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["온도 센서", "무선 온도 센서", "MBL 온도 센서", "온도센서", "온도 측정기"] },
  // ... (나머지 STANDARD_EQUIPMENT 데이터 유지)
];

export default function App() {
  const [textbooks, setTextbooks] = useState([]);
  const [copyState, setCopyState] = useState('idle');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const fileInputRef = useRef(null);
  
  // ★ 수정: 초기값을 빈 문자열과 true로 설정하고, useEffect에서 로컬 스토리지 확인
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState(""); // input 태그를 제어하기 위한 상태
  const [isKeyEditing, setIsKeyEditing] = useState(true);

  // 컴포넌트 마운트 시 클라이언트 환경에서만 localStorage 접근
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('geminiApiKey');
      if (storedKey) {
        setApiKey(storedKey);
        setInputKey(storedKey);
        setIsKeyEditing(false);
      }
    }
  }, []);

  const saveApiKey = () => {
    setApiKey(inputKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('geminiApiKey', inputKey);
    }
    setIsKeyEditing(false);
  };

  // ... (이후 processFiles, mapToStandardDb 등 기존 로직이 이곳에 들어가야 합니다) ...

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* API 키 설정 섹션 */}
        {isKeyEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
              <Key className="text-blue-500" /> 설정: Gemini API 키 입력
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              동료 교사분들도 구글 AI Studio에서 무료 API 키를 발급받아 아래에 입력하면 바로 사용할 수 있습니다.
            </p>
            <div className="flex gap-3">
              {/* ★ 수정: document.getElementById 대신 value와 onChange로 상태 연결 */}
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={saveApiKey}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                저장 및 시작
              </button>
            </div>
          </div>
        ) : (
          <div className="text-right">
             <button 
               onClick={() => setIsKeyEditing(true)} 
               className="text-xs text-slate-400 hover:text-blue-600 underline"
             >
               API 키 변경하기
             </button>
          </div>
        )}

        {/* 여기에 기존 UI 로직(파일 업로드, 결과 출력 등)이 렌더링되어야 합니다. */}
        {/* 예시: {!isKeyEditing && <div className="p-4 bg-white rounded-xl shadow">앱 메인 화면</div>} */}
      </div>
    </div>
  );
}
