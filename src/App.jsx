import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, CheckCircle2, Image as ImageIcon, Loader2, AlertCircle, ClipboardPaste, FileText, HelpCircle, Key } from 'lucide-react';

// --- 2022 개정 과학교구 설비 기준 내장 데이터베이스 ---
// (이전과 동일하므로 생략)
const STANDARD_EQUIPMENT = [
  { category: "공통-측정교구", name: "전자저울", spec: "칭량 100~500 g, 감량 0.1 g", requirement: "4학생당 1", type: "필수", keywords: ["전자저울", "저울"] },
  { category: "공통-측정교구", name: "디지털 온도계", spec: "접촉식, 온도범위 약 -40~200 ℃", requirement: "4학생당 1", type: "필수", keywords: ["디지털 온도계", "디지털온도계"] },
  { category: "공통-측정교구", name: "센서(온도)", spec: "온도 범위 약 -40~125 ℃, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["온도 센서", "무선 온도 센서", "MBL 온도 센서", "온도센서", "온도 측정기"] },
  { category: "공통-측정교구", name: "온도계", spec: "알코올, -10~100 ℃ 이상", requirement: "4학생당 1", type: "필수", keywords: ["온도계", "알코올 온도계", "유리 온도계"] },
  { category: "공통-측정교구", name: "초시계", spec: "디지털식", requirement: "4학생당 1", type: "권장", keywords: ["초시계", "스톱워치"] },
  { category: "공통-측정교구", name: "줄자", spec: "2m 이상", requirement: "4학생당 1", type: "필수", keywords: ["줄자", "자", "플라스틱 자", "막대자", "30cm 자"] },
  { category: "공통-일반교구", name: "비커", spec: "각종(50~1,000mL)", requirement: "4학생당 1", type: "필수", keywords: ["비커", "유리 비커", "유리비커", "플라스틱 비커"] },
  { category: "공통-일반교구", name: "시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["시험관", "유리 시험관"] },
  { category: "공통-일반교구", name: "가지 달린 시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["가지 달린 시험관", "가지달린시험관"] },
  { category: "공통-일반교구", name: "플라스크", spec: "각종(삼각, 둥근바닥 등)", requirement: "4학생당 1", type: "필수", keywords: ["플라스크", "둥근바닥 플라스크", "삼각 플라스크", "둥근 바닥 플라스크", "삼각플라스크"] },
  { category: "공통-일반교구", name: "전열기(또는 핫플레이트)", spec: "AC, 500~1,000 W", requirement: "4학생당 1", type: "필수", keywords: ["전열기", "핫플레이트", "가열 장치", "가열장치"] },
  { category: "공통-일반교구", name: "철제스탠드", spec: "클램프, 링 등 부속품 포함", requirement: "4학생당 1조", type: "필수", keywords: ["철제스탠드", "스탠드", "철제 스탠드", "스텐드", "가열용 스탠드"] },
  { category: "공통-일반교구", name: "끓음쪽", spec: "도자기 조각 등", requirement: "4학생당 1", type: "필수", keywords: ["끓음쪽", "비등석"] },
  { category: "공통-일반교구", name: "고무 마개", spec: "각종(구멍 뚫린 것 포함)", requirement: "4학생당 1조", type: "필수", keywords: ["고무 마개", "고무마개", "실리콘 마개", "실리콘마개"] },
  { category: "공통-일반교구", name: "페트리접시", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["페트리접시", "페트리 접시"] },
  { category: "공통-일반교구", name: "스마트 기기", spec: "태블릿 PC 등", requirement: "4학생당 1", type: "필수", keywords: ["스마트 기기", "스마트기기", "태블릿", "스마트폰", "노트북", "PC"] },
  { category: "공통-일반교구", name: "깔때기", spec: "약 Ø60 mm, 유리(플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["깔때기"] },
  { category: "공통-일반교구", name: "유리막대", spec: "Ø5 mm, 길이 약 300 mm", requirement: "4학생당 1", type: "필수", keywords: ["유리막대", "유리 막대"] },
  { category: "공통-일반교구", name: "약숟가락", spec: "스테인리스 강제", requirement: "4학생당 1", type: "권장", keywords: ["약숟가락", "시약스푼", "약 숟가락"] },
  { category: "공통-일반교구", name: "약포지(시약포지)", spec: "각종", requirement: "4학생당 1", type: "권장", keywords: ["약포지", "시약포지", "유산지"] },
  { category: "공통-일반교구", name: "시험관 집게", spec: "철제 또는 목제", requirement: "2학생당 1", type: "필수", keywords: ["시험관 집게", "시험관집게", "집게"] },
  { category: "공통-일반교구", name: "교반기", spec: "자석식 교반기(가열 겸용 포함)", requirement: "4학생당 1", type: "권장", keywords: ["교반기", "자석 젓개", "자석교반기", "자석젓개"] },
  { category: "공통-일반교구", name: "시험관대", spec: "목제 또는 플라스틱제", requirement: "4학생당 1", type: "필수", keywords: ["시험관대", "가열용 시험관대", "시험관 대"] },
  { category: "공통-일반교구", name: "스포이트", spec: "각종", requirement: "4학생당 1", type: "필수", keywords: ["스포이트", "스포이드", "피펫"] },
  { category: "공통-일반교구", name: "수조", spec: "각종(유리, 플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["수조", "물통"] },
  { category: "공통-일반교구", name: "유리병", spec: "뚜껑 포함", requirement: "4학생당 1", type: "필수", keywords: ["유리병", "뚜껑 있는 유리병", "뚜껑있는유리병", "집기병"] },
  { category: "공통-일반교구", name: "눈금실린더", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["눈금실린더", "메스실린더"] },
  { category: "공통-일반교구", name: "핀셋", spec: "스테인리스", requirement: "4학생당 1", type: "필수", keywords: ["핀셋", "핀셑"] },
  { category: "공통-일반교구", name: "돋보기", spec: "각종", requirement: "4학생당 1", type: "권장", keywords: ["돋보기", "확대경", "루페"] },
  { category: "안전장구", name: "학생용 실험복", spec: "면소재 실험복", requirement: "1학생당 1", type: "필수", keywords: ["실험복", "학생용 실험복", "가운"] },
  { category: "안전장구", name: "내열 장갑", spec: "내열온도 200 ℃", requirement: "학교당 6", type: "필수", keywords: ["내열 장갑", "내열장갑", "화상 방지 장갑"] },
  { category: "안전장구", name: "(안전)장갑", spec: "1회용 (폴리에틸렌, 라텍스, 나이트릴)", requirement: "1학생당 1", type: "필수", keywords: ["장갑", "안전장갑", "실험용 장갑", "라텍스 장갑", "니트릴 장갑", "면장갑", "실험용장갑", "고무장갑"] },
  { category: "안전장구", name: "보안경", spec: "안경식", requirement: "1학생당 1", type: "필수", keywords: ["보안경", "안전경", "고글"] }
];

export default function App() {
  const [textbooks, setTextbooks] = useState([]);
  const [copyState, setCopyState] = useState('idle');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const fileInputRef = useRef(null);
  
  // ★ API 키 브라우저 저장 기능
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || "");
  const [isKeyEditing, setIsKeyEditing] = useState(!apiKey);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setIsKeyEditing(false);
  };

  // ... (이후 processFiles, mapToStandardDb 등 기존 로직 동일) ...
  // ★ 주의: processFiles 함수에서 API 호출 시 apiKey를 인자로 전달받도록 구성하세요

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ★ API 키 설정 섹션 추가 */}
        {isKeyEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
              <Key className="text-blue-500" /> 설정: Gemini API 키 입력
            </h2>
            <p className="text-sm text-slate-600 mb-6">동료 교사분들도 구글 AI Studio에서 무료 API 키를 발급받아 아래에 입력하면 바로 사용할 수 있습니다.</p>
            <div className="flex gap-3">
              <input 
                id="apiKeyInput"
                type="password" 
                placeholder="AIzaSy..." 
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={apiKey}
              />
              <button 
                onClick={() => saveApiKey(document.getElementById('apiKeyInput').value)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                저장 및 시작
              </button>
            </div>
          </div>
        ) : (
          <div className="text-right">
             <button onClick={() => setIsKeyEditing(true)} className="text-xs text-slate-400 hover:text-blue-600 underline">
               API 키 변경하기
             </button>
          </div>
        )}

        {/* ... (기존 UI 로직 동일) ... */}
      </div>
    </div>
  );
}