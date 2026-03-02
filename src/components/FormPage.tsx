// src/components/FormPage.tsx
import React, { useState, useRef } from "react";
import { Company } from "../types";
import { FORM_FIELDS } from "../data";
import { buildDoc, printHtml } from "../lib/hr-utils";

interface FormPageProps {
  activeForm: string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  company: Company;
  onBack: () => void;
}

export const FormPage: React.FC<FormPageProps> = ({ 
  activeForm, formData, setFormData, company, onBack 
}) => {
  const def = FORM_FIELDS[activeForm];
  const c = company.primaryColor;

  const [stampMode, setStampMode] = useState<"manual" | "digital" | "none">(company.stampMode || "manual");
  const [stampImage, setStampImage] = useState<string | null>(company.stampImage || null);
  const [isEditing, setIsEditing] = useState(false);
  const [customHtml, setCustomHtml] = useState<string | null>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleStampFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { 
      if (ev.target?.result) {
        setStampImage(ev.target.result as string); 
        setStampMode("digital"); 
      }
    };
    r.readAsDataURL(f);
  };

  const printCompany: Company = { ...company, stampMode, stampImage: stampMode === "digital" ? stampImage : null };
  const preview = customHtml || buildDoc(activeForm, formData, printCompany);

  const doPrint = () => printHtml(preview);

  const toggleEdit = () => {
    if (isEditing) {
      // Save
      if (editorRef.current) {
        setCustomHtml(editorRef.current.innerHTML);
      }
      setIsEditing(false);
    } else {
      // Start editing
      if (!customHtml) {
        setCustomHtml(buildDoc(activeForm, formData, printCompany));
      }
      setIsEditing(true);
    }
  };

  const resetCustom = () => {
    setCustomHtml(null);
    setIsEditing(false);
  };

  const stampOpts = [
    { id:"digital", icon:"✅", ar:"ختم رقمي",    en:"Digital" },
    { id:"manual",  icon:"⭕", ar:"ختم يدوي",     en:"Manual" },
    { id:"none",    icon:"✍️", ar:"توقيع فقط",    en:"Sig only" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans antialiased pb-10" style={{ direction: "rtl" }}>
      <header className="sticky top-0 z-50 px-4 md:px-7 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-md text-white" style={{ background: c }}>
        <button onClick={onBack} className="bg-white/20 border-none text-white px-3 py-1.5 rounded-lg cursor-pointer text-xs hover:bg-white/30 transition-colors self-start sm:self-auto">← رجوع</button>
        <h1 className="m-0 text-sm md:text-base font-bold text-center sm:text-right">
          {def?.title} 
          <span className="block sm:inline font-normal text-[10px] md:text-xs opacity-80 sm:mr-2">| {def?.titleEn}</span>
        </h1>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm h-fit lg:sticky lg:top-24">
          <h3 className="m-0 mb-5 text-sm font-bold" style={{ color: c }}>بيانات النموذج</h3>
          <div className="space-y-4">
            {def?.fields.map(f=>(
              <div key={f.key}>
                <label className="block mb-1.5 text-[11px] font-bold text-gray-600">
                  {f.label} <span className="text-[10px] text-gray-400 font-normal mr-1">/ {f.labelEn}</span>
                </label>
                {f.type==="textarea"
                  ? <textarea value={formData[f.key]||""} onChange={e=>setFormData((p: any)=>({...p,[f.key]:e.target.value}))}
                      placeholder={f.placeholder} rows={f.rows||4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:outline-none transition-all resize-none"
                      style={{ "--tw-ring-color": c + "44" } as any} />
                  : f.type==="select"
                  ? <select value={formData[f.key]||""} onChange={e=>setFormData((p: any)=>({...p,[f.key]:e.target.value}))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:outline-none transition-all bg-white"
                      style={{ "--tw-ring-color": c + "44" } as any}>
                      <option value="">-- اختر --</option>
                      {f.options?.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  : <input type={f.type||"text"} value={formData[f.key]||""} onChange={e=>setFormData((p: any)=>({...p,[f.key]:e.target.value}))}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:outline-none transition-all"
                      style={{ "--tw-ring-color": c + "44" } as any} />
                }
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-[11px] font-bold text-gray-600 mb-4">
              🔏 الختم والتوقيع <span className="text-[10px] text-gray-400 font-normal mr-1">Stamp & Signature</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {stampOpts.map((o: any)=>(
                <div key={o.id} onClick={()=>setStampMode(o.id)}
                  className={`border-2 rounded-xl p-2 cursor-pointer text-center transition-all ${stampMode===o.id ? 'border-current bg-current/5' : 'border-gray-100 bg-gray-50'}`}
                  style={{ color: stampMode===o.id ? c : "#666" }}>
                  <div className="text-xl mb-1">{o.icon}</div>
                  <div className="text-[9px] font-bold leading-tight">{o.ar}</div>
                  <div className="text-[8px] opacity-60 uppercase">{o.en}</div>
                </div>
              ))}
            </div>

            {stampMode === "digital" && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-4 mb-3">
                {stampImage
                  ? <img src={stampImage} className="h-12 w-12 object-contain border border-gray-200 rounded-lg bg-white p-1 shrink-0" />
                  : <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-[8px] text-gray-400 text-center shrink-0 leading-tight">لا<br/>ختم</div>
                }
                <div className="flex flex-col gap-2 flex-1">
                  <button onClick={()=>stampInputRef.current?.click()}
                    className="w-full py-1.5 rounded-lg font-bold text-[10px] text-white transition-all hover:opacity-90" style={{ background: c }}>
                    📁 رفع الختم
                  </button>
                  {stampImage && (
                    <button onClick={()=>setStampImage(null)}
                      className="w-full py-1.5 rounded-lg font-bold text-[10px] text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all">
                      🗑️ إزالة
                    </button>
                  )}
                </div>
                <input ref={stampInputRef} type="file" accept="image/*" className="hidden" onChange={handleStampFile} />
              </div>
            )}

            {stampMode === "manual" && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 mb-3">
                <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[8px] text-gray-300 text-center leading-tight">ختم</span>
                </div>
                <span className="text-[10px] text-gray-500 leading-tight">دائرة فارغة للختم اليدوي بعد الطباعة</span>
              </div>
            )}

            {stampMode === "none" && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-[10px] text-gray-500 mb-3">
                ✍️ توقيعات فقط — بدون مساحة ختم
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={()=>setFormData({})}
              className="flex-1 bg-gray-100 border border-gray-200 py-3 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-200 transition-all">
              🗑️ مسح
            </button>
            <button onClick={doPrint}
              className="flex-[2] py-3 rounded-xl font-black text-xs text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: c }}>
              🖨️ طباعة
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="m-0 text-sm font-bold" style={{ color: c }}>معاينة / Preview</h3>
            <div className="flex flex-wrap justify-center gap-2 items-center">
              {customHtml && (
                <button onClick={resetCustom}
                  className="bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] hover:bg-gray-50 transition-all">
                  🔄 إعادة تعيين
                </button>
              )}
              <button onClick={toggleEdit}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${isEditing ? 'text-white' : 'bg-white'}`}
                style={{ background: isEditing ? c : "transparent", color: isEditing ? "#fff" : c, borderColor: c }}>
                {isEditing ? "💾 حفظ التعديلات" : "✏️ تعديل النص النهائي"}
              </button>
              <span className="text-[9px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">Bilingual</span>
              <button onClick={doPrint}
                className="px-5 py-1.5 rounded-lg font-bold text-[11px] text-white shadow-sm transition-all hover:opacity-90" style={{ background: c }}>
                🖨️ طباعة
              </button>
            </div>
          </div>
          
          {isEditing && (
            <div className="p-3 rounded-xl mb-4 text-[10px] md:text-xs border" style={{ background: c + "10", color: c, borderColor: c + "22" }}>
              💡 <strong>وضع التعديل المباشر:</strong> يمكنك الآن الضغط على أي نص في المعاينة أدناه وتعديله أو حذفه أو إضافة نصوص جديدة قبل الطباعة.
            </div>
          )}

          <div 
            ref={editorRef}
            contentEditable={isEditing}
            dangerouslySetInnerHTML={{__html:preview}}
            className={`p-6 md:p-10 rounded-xl border-2 transition-all outline-none overflow-x-auto ${isEditing ? 'bg-white' : 'bg-gray-50/50'}`}
            style={{ 
              borderColor: isEditing ? c : "#f3f4f6",
              direction: "rtl"
            }} 
          />
        </div>
      </div>
    </div>
  );
};
