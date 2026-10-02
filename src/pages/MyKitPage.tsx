import React from 'react';
import { Link } from 'react-router';
import { useMedications } from '../hooks/useMedications';
import { useMedicationStore } from '../stores/useMedicationStore';
import MedicationCard from '../components/MedicationCard';

export const MyKitPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useMedications();
  const { myKit, toggleKit } = useMedicationStore();

  if (isLoading) {
    return <div className="text-center py-20 text-lg">กำลังโหลดกระเป๋ายา... <span className="loading loading-dots loading-md"></span></div>;
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-error mb-4">เกิดข้อผิดพลาดในการดึงข้อมูล</p>
        <button onClick={() => refetch()} className="btn btn-sm btn-outline">ลองใหม่</button>
      </div>
    );
  }

  // คัดกรองเอาเฉพาะยาที่มี ID ตรงกับใน Store
  const savedMeds = (data || []).filter((med: any) => myKit.includes(med.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-base-200 pb-4 ">
        <h1 className="text-3xl font-bold text-primary">กระเป๋ายาส่วนตัว</h1>
        <div className="badge badge-primary badge-lg w-24">{savedMeds.length} รายการ</div>
      </div>

      {savedMeds.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">กระเป๋ายาของคุณยังว่างเปล่า</h3>
          <p className="text-base-content/60 mb-6">กลับไปที่หน้าหลักเพื่อเลือกยาที่ต้องการบันทึกเก็บไว้</p>
          <Link to="/" className="btn btn-primary">ค้นหารายการยา</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {savedMeds.map((med: any) => (
            <div key={med.id} className="relative group">
              <MedicationCard medication={med} />
              <button 
                onClick={() => toggleKit(med.id)} 
                className="btn btn-sm btn-error btn-circle absolute -top-2 -right-2 text-white shadow-lg z-10 opacity-90 hover:opacity-100 transition-opacity"
                title="ลบออกจากกระเป๋ายา"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};