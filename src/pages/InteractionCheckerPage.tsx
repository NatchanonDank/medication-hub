import React, { useState } from 'react';
import { useMedications } from '../hooks/useMedications';

export const InteractionCheckerPage: React.FC = () => {
  const { data: medications, isLoading, isError } = useMedications();
  const [med1Id, setMed1Id] = useState<string>('');
  const [med2Id, setMed2Id] = useState<string>('');
  const [result, setResult] = useState<{ status: 'safe' | 'warning' | 'danger'; message: string } | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 font-medium">กำลังโหลดฐานข้อมูลยา...</p>
      </div>
    );
  }

  if (isError || !medications) {
    return <div className="text-center py-20 text-error font-bold text-lg">ไม่สามารถโหลดข้อมูลเพื่อตรวจสอบได้</div>;
  }

  const checkInteraction = () => {
    if (!med1Id || !med2Id) return;
    
    if (med1Id === med2Id) {
      setResult({ 
        status: 'warning', 
        message: 'คุณเลือกยาทั้งสองชนิดซ้ำกัน กรุณาเลือกยาที่แตกต่างกันเพื่อตรวจสอบ' 
      });
      return;
    }

    const med1 = medications.find((m: any) => String(m.id) === med1Id);
    const med2 = medications.find((m: any) => String(m.id) === med2Id);

    if (!med1 || !med2) return;

    // --- ฟังก์ชันช่วยเหลือสำหรับการจัดกลุ่มยา ---
    const isCategory = (cat: string) => med1.category === cat || med2.category === cat;
    const hasName = (...names: string[]) => names.some(n => med1.name.includes(n) || med2.name.includes(n) || med1.genericName.includes(n) || med2.genericName.includes(n));
    const bothHaveCategory = (cat: string) => med1.category === cat && med2.category === cat;
    const cnsDrugs = ['Alprazolam', 'Amitriptyline', 'Gabapentin', 'Tramadol', 'Diazepam'];
    const isBothCNS = cnsDrugs.some(d => med1.genericName.includes(d)) && cnsDrugs.some(d => med2.genericName.includes(d));
    
    // จัดกลุ่มยาตามการออกฤทธิ์
    const isNSAID = isCategory('NSAID');
    const isBloodThinner = hasName('Warfarin', 'Apixaban', 'Clopidogrel', 'Enoxaparin', 'Aspirin') || isCategory('Anticoagulant');
    const isSSRI = hasName('Sertraline', 'Escitalopram', 'Fluoxetine');
    const isTramadol = hasName('Tramadol');
    const isStatin = hasName('Atorvastatin', 'Rosuvastatin', 'Simvastatin');
    const isFluconazole = hasName('Fluconazole');
    const isDigoxin = hasName('Digoxin');
    const isDiuretic = isCategory('Cardiovascular') && hasName('Furosemide', 'Hydrochlorothiazide'); 
    const isPotassiumSparing = hasName('Spironolactone');
    const isAceArb = hasName('Lisinopril', 'Valsartan', 'Losartan');
    const isPPI = hasName('Omeprazole', 'Pantoprazole');
    const isClopidogrel = hasName('Clopidogrel');
    const isMethotrexate = hasName('Methotrexate');

    // เช็คจาก field interactions ใน JSON
    const hasInteractionJson1 = med1.interactions?.some((i: string) => i.toLowerCase().includes(med2.genericName.toLowerCase()) || i.toLowerCase().includes(med2.brandName?.toLowerCase() || ''));
    const hasInteractionJson2 = med2.interactions?.some((i: string) => i.toLowerCase().includes(med1.genericName.toLowerCase()) || i.toLowerCase().includes(med1.brandName?.toLowerCase() || ''));

    // ตรวจสอบกลุ่มเสี่ยงอันตราย (Danger)
    if (isNSAID && isBloodThinner) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาแก้ปวดกลุ่ม NSAID ร่วมกับยาละลายลิ่มเลือด/ต้านเกล็ดเลือด เพิ่มความเสี่ยงเลือดออกในทางเดินอาหารขั้นรุนแรง` });
    }
    else if (isSSRI && isTramadol) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาทั้งสองตัวนี้ร่วมกัน เพิ่มความเสี่ยงให้เกิดภาวะ Serotonin Syndrome (ไข้สูง, กล้ามเนื้อกระตุก, สับสน) ซึ่งเป็นอันตรายถึงชีวิต` });
    }
    else if (isStatin && isFluconazole) {
      setResult({ status: 'danger', message: `อันตราย! ยาฆ่าเชื้อรา Fluconazole จะเพิ่มระดับยาลดไขมัน Statin ในเลือด ทำให้เสี่ยงต่อภาวะกล้ามเนื้อลายสลายตัว (Rhabdomyolysis)` });
    }
    else if (hasName('Warfarin') && isFluconazole) {
      setResult({ status: 'danger', message: `อันตราย! Fluconazole เพิ่มระดับยา Warfarin ในเลือดอย่างมาก ทำให้เสี่ยงต่อภาวะเลือดออกรุนแรง ต้องปรึกษาแพทย์ทันที` });
    }
    else if (isAceArb && isPotassiumSparing) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาลดความดัน (ACEi/ARB) ร่วมกับ Spironolactone อาจทำให้ระดับโพแทสเซียมในเลือดสูงเกินไป (Hyperkalemia) ซึ่งมีผลต่อจังหวะหัวใจ` });
    }
    else if (isDigoxin && isDiuretic && !isPotassiumSparing) {
      setResult({ status: 'danger', message: `อันตราย! ยาขับปัสสาวะอาจทำให้โพแทสเซียมต่ำ ซึ่งจะเพิ่มความเป็นพิษของ Digoxin (คลื่นไส้, ตาพร่า, หัวใจเต้นผิดจังหวะ)` });
    }
    
    // ตรวจสอบกลุ่มควรเฝ้าระวัง (Warning)
    else if (isPPI && isClopidogrel) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาลดกรด (โดยเฉพาะ Omeprazole) อาจลดประสิทธิภาพของยา Clopidogrel ในการป้องกันลิ่มเลือด ควรปรึกษาแพทย์` });
    }
    else if (isMethotrexate && isNSAID) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดการขับออกของ Methotrexate ทำให้ระดับยาในร่างกายสูงขึ้นและเกิดความเป็นพิษได้` });
    }
    else if (isBothCNS) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: การใช้ยากดประสาท/คลายกังวล/แก้ปวด ร่วมกัน จะเสริมฤทธิ์ทำให้ง่วงซึมรุนแรง กดการหายใจ และเสี่ยงต่ออุบัติเหตุ` });
    }
    else if (isSSRI && isNSAID) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: การทานยาต้านเศร้ากลุ่ม SSRI ร่วมกับยาแก้ปวด NSAID เพิ่มความเสี่ยงให้เกิดแผลและเลือดออกในกระเพาะอาหาร` });
    }
    else if (isNSAID && (isAceArb || isDiuretic)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดประสิทธิภาพของยาลดความดันโลหิตและยาขับปัสสาวะ และอาจทำให้การทำงานของไตแย่ลง` });
    }
    else if (bothHaveCategory('Cardiovascular') || bothHaveCategory('Psychiatric')) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาทั้งสองชนิดอยู่ในกลุ่มการรักษาเดียวกัน อาจเกิดการเสริมฤทธิ์กัน (เช่น ความดันตกมากเกินไป หรือง่วงซึมมาก) ควรใช้ภายใต้คำสั่งแพทย์` });
    }
    // ดักจับจากข้อมูล JSON เสริม
    else if (hasInteractionJson1 || hasInteractionJson2) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: พบข้อมูลการเกิดปฏิกิริยาระหว่างยา ${med1.name} และ ${med2.name} ในฐานข้อมูล โปรดปรึกษาแพทย์หรือเภสัชกรก่อนใช้ร่วมกัน` });
    }
    
    // ปลอดภัย (Safe)
    else {
      setResult({ status: 'safe', message: `ปลอดภัย: ไม่พบปฏิกิริยารุนแรงระหว่าง ${med1.name} และ ${med2.name} ในระบบเบื้องต้น อย่างไรก็ตามหากมีอาการผิดปกติควรปรึกษาเภสัชกร` });
    }
  };

  const resetChecker = () => {
    setMed1Id('');
    setMed2Id('');
    setResult(null);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">ตรวจสอบปฏิกิริยาระหว่างยา</h1>
        <p className="text-base-content/70">เลือกยา 2 ชนิดเพื่อตรวจสอบความเสี่ยงเมื่อรับประทานร่วมกัน</p>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200 max-w-4xl mx-auto">
        <div className="card-body p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="form-control w-full flex-1">
              <label className="label pb-3">
                <span className="label-text font-bold text-base-content/80 text-base flex items-center gap-2">
                  <span className="w-4 badge badge-primary badge-sm">1</span> ยาชนิดที่ 1
                </span>
              </label>
              <select 
                className="select select-bordered select-lg w-full text-base shadow-sm focus:border-primary" 
                value={med1Id} 
                onChange={(e) => setMed1Id(e.target.value)}
              >
                <option value="" disabled>-- เลือกยาชนิดที่ 1 --</option>
                {medications.map((med: any) => (
                  <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-base-200 border border-base-300 text-base-content/50 font-bold text-xl my-2 md:my-0 md:mt-12 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <div className="form-control w-full flex-1">
              <label className="label pb-3">
                <span className="label-text font-bold text-base-content/80 text-base flex items-center gap-2">
                  <span className="w-4 badge badge-primary badge-sm">2</span> ยาชนิดที่ 2
                </span>
              </label>
              <select 
                className="select select-bordered select-lg w-full text-base shadow-sm focus:border-primary" 
                value={med2Id} 
                onChange={(e) => setMed2Id(e.target.value)}
              >
                <option value="" disabled>-- เลือกยาชนิดที่ 2 --</option>
                {medications.map((med: any) => (
                  <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
                ))}
              </select>
            </div>
            
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button 
              className="btn btn-primary px-10 text-base shadow-sm" 
              onClick={checkInteraction} 
              disabled={!med1Id || !med2Id}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              ตรวจสอบ
            </button>
            <button className="btn btn-ghost text-base-content/70" onClick={resetChecker}>
              ล้างค่า
            </button>
          </div>

          <div className="divider mt-8 mb-4 text-base-content/30 text-sm">ผลการตรวจสอบ</div>
          <div className="min-h-[100px] flex items-center justify-center">
            {!result && (
              <div className="text-center text-base-content/40 border-2 border-dashed border-base-300 rounded-xl p-8 w-full">
                ผลลัพธ์การตรวจสอบปฏิกิริยายาจะแสดงที่นี่
              </div>
            )}

            {result && (
              <div className="w-full animate-fade-in">
                <div className={`alert ${result.status === 'safe' ? 'alert-success text-white' : result.status === 'warning' ? 'alert-warning' : 'alert-error text-white'} shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      {result.status === 'safe' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {result.status === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                      {result.status === 'danger' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {result.status === 'safe' && 'สามารถทานร่วมกันได้'}
                        {result.status === 'warning' && 'ควรระมัดระวัง'}
                        {result.status === 'danger' && 'ห้ามทานร่วมกันเด็ดขาด'}
                      </h3>
                      <p className="mt-1 text-sm sm:text-base leading-relaxed">{result.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};