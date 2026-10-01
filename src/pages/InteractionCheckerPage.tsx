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
      setResult({ status: 'warning', message: 'คุณเลือกยาทั้งสองชนิดซ้ำกัน กรุณาเลือกยาที่แตกต่างกัน' });
      return;
    }

    const med1 = medications.find((m) => m.id === med1Id);
    const med2 = medications.find((m) => m.id === med2Id);

    if (!med1 || !med2) return;
    // จำลองกฎการชนกันของยา
    const isNSAID = med1.category === 'NSAID' || med2.category === 'NSAID';
    const isBloodThinner = med1.id === '3' || med2.id === '3' || med1.id === '16' || med2.id === '16'; // Warfarin, Apixaban
    const isBP = med1.category === 'Cardiovascular' || med2.category === 'Cardiovascular';

    if (isNSAID && isBloodThinner) {
      setResult({
        status: 'danger',
        message: `อันตราย! การทาน ${med1.name} ร่วมกับ ${med2.name} เพิ่มความเสี่ยงในการมีเลือดออกในกระเพาะอาหารขั้นรุนแรง`,
      });
    } else if (isNSAID && isBP) {
      setResult({
        status: 'warning',
        message: `เฝ้าระวัง: ${med1.name} และ ${med2.name} เมื่อทานร่วมกันอาจทำให้ประสิทธิภาพของยาลดความดันโลหิตลดลง ควรปรึกษาแพทย์`,
      });
    } else {
      setResult({
        status: 'safe',
        message: `ปลอดภัย: ไม่พบปฏิกิริยารุนแรงระหว่าง ${med1.name} และ ${med2.name} ในฐานข้อมูลเบื้องต้น`,
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