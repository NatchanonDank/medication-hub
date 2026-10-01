import React from 'react';
import { Link } from 'react-router';
import { useMedications } from '../hooks/useMedications';
import { useMedicationStore } from '../stores/useMedicationStore';

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

  // คัดกรองเอาเฉพาะยาที่มี ID ตรงกับใน Zustand Store
  const savedMeds = (data || []).filter((med) => myKit.includes(med.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-base-200 pb-4 ">
        <h1 className="text-3xl font-bold text-primary">กระเป๋ายาส่วนตัว</h1>
        <div className="badge badge-primary w-20 ">{savedMeds.length} รายการ</div>
      </div>

      {savedMeds.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">กระเป๋ายาของคุณยังว่างเปล่า</h3>
          <p className="text-base-content/60 mb-6">กลับไปที่หน้าหลักเพื่อเลือกยาที่ต้องการบันทึกเก็บไว้</p>
          <Link to="/" className="btn btn-primary">ค้นหารายการยา</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedMeds.map((med) => (
            <div key={med.id} className="card bg-base-100 shadow-md border border-base-200">
              <figure className="px-4 pt-4">
                <img 
                  src={med.imageUrl} 
                  alt={med.name} 
                  className="h-32 object-contain mx-auto" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                  }}
                />
              </figure>
              <div className="card-body p-4 text-center">
                <h3 className="card-title text-lg justify-center">{med.name}</h3>
                <p className="text-sm text-base-content/70 line-clamp-1">{med.use}</p>
                <div className="card-actions justify-center mt-3 gap-2">
                  <Link to={`/medication/${med.id}`} className="btn btn-sm btn-ghost">รายละเอียด</Link>
                  <button onClick={() => toggleKit(med.id)} className="btn btn-sm btn-error text-white">
                    ลบออก
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};