import React, { useState } from 'react';
import { useMedications } from '../hooks/useMedications';

export const InteractionCheckerPage: React.FC = () => {
  const { data: medications, isLoading, isError } = useMedications();
  const [med1Id, setMed1Id] = useState<string>('');
  const [med2Id, setMed2Id] = useState<string>('');
  // State สำหรับเก็บผลลัพธ์การตรวจสอบ
  const [result, setResult] = useState<{ status: 'safe' | 'warning' | 'danger'; message: string } | null>(null);

  if (isLoading) {
    return <div className="text-center py-20">กำลังโหลดฐานข้อมูลยา... <span className="loading loading-spinner text-primary"></span></div>;
  }

  if (isError || !medications) {
    return <div className="text-center py-20 text-error">ไม่สามารถโหลดข้อมูลเพื่อตรวจสอบได้</div>;
  }

  // จำลองการตรวจสอบปฏิกิริยาระหว่างยา
const checkInteraction = () => {
    if (!med1Id || !med2Id) return;
    
    if (med1Id === med2Id) {
      setResult({ 
        status: 'warning', 
        message: 'คุณเลือกยาทั้งสองชนิดซ้ำกัน กรุณาเลือกยาที่แตกต่างกันเพื่อตรวจสอบ' 
      });
      return;
    }

    const med1 = medications.find((m) => m.id === med1Id);
    const med2 = medications.find((m) => m.id === med2Id);

    if (!med1 || !med2) return;

    // สำหรับจัดกลุ่มยา
    const isCategory = (cat: string) => med1.category === cat || med2.category === cat;
    const hasName = (...names: string[]) => names.some(n => med1.name.includes(n) || med2.name.includes(n));
    const bothHaveCategory = (cat: string) => med1.category === cat && med2.category === cat;
    const isBothCNS = ['Alprazolam', 'Amitriptyline', 'Gabapentin', 'Tramadol'].includes(med1.name) && ['Alprazolam', 'Amitriptyline', 'Gabapentin', 'Tramadol'].includes(med2.name);

    // จัดกลุ่มยาตามการออกฤทธิ์
    const isNSAID = isCategory('NSAID');
    const isBloodThinner = hasName('Warfarin', 'Apixaban', 'Clopidogrel', 'Enoxaparin', 'Aspirin');
    const isSSRI = hasName('Sertraline', 'Escitalopram');
    const isTramadol = hasName('Tramadol');
    const isStatin = hasName('Atorvastatin', 'Rosuvastatin');
    const isFluconazole = hasName('Fluconazole');
    const isDigoxin = hasName('Digoxin');
    const isDiuretic = isCategory('Diuretic'); 
    const isPotassiumSparing = hasName('Spironolactone');
    const isAceArb = hasName('Lisinopril', 'Valsartan', 'Losartan');
    const isPPI = hasName('Omeprazole', 'Pantoprazole');
    const isClopidogrel = hasName('Clopidogrel');
    const isMethotrexate = hasName('Methotrexate');

    // ตรวจสอบปฏิกิริยาระหว่างยา

    // กลุ่มเสี่ยงอันตราย (Danger)
    if (isNSAID && isBloodThinner) {
      setResult({
        status: 'danger',
        message: `อันตราย! การใช้ยาแก้ปวดกลุ่ม NSAID ร่วมกับยาละลายลิ่มเลือด/ต้านเกล็ดเลือด เพิ่มความเสี่ยงเลือดออกในทางเดินอาหารขั้นรุนแรง`,
      });
    }
    else if (isSSRI && isTramadol) {
      setResult({
        status: 'danger',
        message: `อันตราย! การใช้ยาทั้งสองตัวนี้ร่วมกัน เพิ่มความเสี่ยงให้เกิดภาวะ Serotonin Syndrome (ไข้สูง, กล้ามเนื้อกระตุก, สับสน) ซึ่งเป็นอันตรายถึงชีวิต`,
      });
    }
    else if (isStatin && isFluconazole) {
      setResult({
        status: 'danger',
        message: `อันตราย! ยาฆ่าเชื้อรา Fluconazole จะเพิ่มระดับยาลดไขมัน Statin ในเลือด ทำให้เสี่ยงต่อภาวะกล้ามเนื้อลายสลายตัว (Rhabdomyolysis)`,
      });
    }
    else if (hasName('Warfarin') && isFluconazole) {
      setResult({
        status: 'danger',
        message: `อันตราย! Fluconazole เพิ่มระดับยา Warfarin ในเลือดอย่างมาก ทำให้เสี่ยงต่อภาวะเลือดออกรุนแรง ต้องปรับขนาดยาและเจาะเลือดดูค่า INR ทันที`,
      });
    }
    else if (isAceArb && isPotassiumSparing) {
      setResult({
        status: 'danger',
        message: `อันตราย! การใช้ยาลดความดัน (ACEi/ARB) ร่วมกับ Spironolactone อาจทำให้ระดับโพแทสเซียมในเลือดสูงเกินไป (Hyperkalemia) ซึ่งมีผลต่อจังหวะการเต้นของหัวใจ`,
      });
    }
    else if (isDigoxin && isDiuretic && !isPotassiumSparing) {
      setResult({
        status: 'danger',
        message: `อันตราย! ยาขับปัสสาวะอาจทำให้โพแทสเซียมต่ำ ซึ่งจะเพิ่มความเป็นพิษของ Digoxin (คลื่นไส้, ตาพร่า, หัวใจเต้นผิดจังหวะ)`,
      });
    }
    
    // กลุ่มควรเฝ้าระวัง (Warning)
    else if (isPPI && isClopidogrel) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: ยาลดกรด (โดยเฉพาะ Omeprazole) อาจลดประสิทธิภาพของยา Clopidogrel ในการป้องกันลิ่มเลือด ควรปรึกษาแพทย์เพื่อปรับยา`,
      });
    }
    else if (isMethotrexate && isNSAID) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดการขับออกของ Methotrexate ทำให้ระดับยาในร่างกายสูงขึ้นและเกิดความเป็นพิษได้`,
      });
    }
    else if (isBothCNS) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: การใช้ยากดประสาท/คลายกังวล/แก้ปวด ร่วมกัน จะเสริมฤทธิ์ทำให้ง่วงซึมรุนแรง กดการหายใจ และเสี่ยงต่อการเกิดอุบัติเหตุ`,
      });
    }
    else if (isSSRI && isNSAID) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: การทานยาต้านเศร้ากลุ่ม SSRI ร่วมกับยาแก้ปวด NSAID เพิ่มความเสี่ยงให้เกิดแผลและเลือดออกในกระเพาะอาหาร`,
      });
    }
    else if (isNSAID && (isAceArb || isDiuretic)) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดประสิทธิภาพของยาลดความดันโลหิตและยาขับปัสสาวะ และอาจทำให้การทำงานของไตแย่ลง`,
      });
    }
    else if (bothHaveCategory('Cardiovascular') || bothHaveCategory('Psychiatric') || bothHaveCategory('Diuretic')) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: ยาทั้งสองชนิดอยู่ในกลุ่มการรักษาเดียวกัน อาจเกิดการเสริมฤทธิ์กัน (เช่น ความดันตกมากเกินไป หรือง่วงซึมมากเกินไป) ควรใช้ภายใต้คำสั่งแพทย์`,
      });
    }
    
    // ปลอดภัย (Safe)
    else {
      setResult({
        status: 'safe',
        message: `ปลอดภัย: ไม่พบปฏิกิริยารุนแรงระหว่าง ${med1.name} และ ${med2.name} ในฐานข้อมูลเบื้องต้น อย่างไรก็ตามหากมีอาการผิดปกติควรปรึกษาแพทย์`,
      });
    }
  };

  const resetChecker = () => {
    setMed1Id('');
    setMed2Id('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">ตรวจสอบปฏิกิริยาระหว่างยา</h1>
        <p className="text-base-content/70">เลือกยา 2 ชนิดเพื่อตรวจสอบความเสี่ยงเมื่อรับประทานร่วมกัน</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* เลือกยาตัวที่ 1 */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">ยาชนิดที่ 1</span></label>
            <select className="select select-bordered w-full" value={med1Id} onChange={(e) => setMed1Id(e.target.value)}>
              <option value="" disabled>-- เลือกยาชนิดที่ 1 --</option>
              {medications.map((med) => (
                <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
              ))}
            </select>
          </div>

          <div className="text-2xl font-bold text-base-content/30 pt-6">+</div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">ยาชนิดที่ 2</span></label>
            <select className="select select-bordered w-full" value={med2Id} onChange={(e) => setMed2Id(e.target.value)}>
              <option value="" disabled>-- เลือกยาชนิดที่ 2 --</option>
              {medications.map((med) => (
                <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button 
            className="btn btn-primary px-8" 
            onClick={checkInteraction} 
            disabled={!med1Id || !med2Id}
          >
            ตรวจสอบ
          </button>
          <button className="btn btn-ghost" onClick={resetChecker}>ล้างค่า</button>
        </div>

        {result && (
          <div className="mt-8 animate-fade-in">
            <div className={`alert ${result.status === 'safe' ? 'alert-success text-white' : result.status === 'warning' ? 'alert-warning' : 'alert-error text-white'} shadow-md`}>
              <div>
                <h3 className="font-bold text-lg">
                  {result.status === 'safe' && '✅ สามารถทานร่วมกันได้'}
                  {result.status === 'warning' && '⚠️ ควรระมัดระวัง'}
                  {result.status === 'danger' && '❌ ห้ามทานร่วมกันเด็ดขาด'}
                </h3>
                <p className="mt-1">{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};