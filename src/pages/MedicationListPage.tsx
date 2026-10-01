import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMedications } from '../hooks/useMedications';
import { useMedicationStore } from '../stores/useMedicationStore';
import type { Medication } from '../types/medication';

export const MedicationListPage: React.FC = () => {
  // 1. ดึงข้อมูลจาก Server State
  const { data, isLoading, isError, error, refetch } = useMedications();
  // 2. ดึงข้อมูลจาก Client State 
  const { myKit, toggleKit } = useMedicationStore();
  // 3. Local State สำหรับช่องค้นหาและตัวกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyKit, setShowOnlyKit] = useState(false);
  // 4. สถานะกำลังโหลดแสดง Skeleton
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton h-12 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl border border-base-300 p-4 space-y-4">
              <div className="skeleton h-40 w-full rounded-md" />
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="flex justify-between items-center pt-4">
                <div className="skeleton h-8 w-24 rounded-lg" />
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // 5. สถานะขัดข้อง แสดง Alert สีแดงพร้อมปุ่ม Retry
  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg">
        <div>
          <h3 className="font-bold text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล!</h3>
          <div className="text-sm">{(error as Error).message}</div>
        </div>
        <button onClick={() => refetch()} className="btn btn-sm btn-outline">
          ลองใหม่ (Retry)
        </button>
      </div>
    );
  }
  // 6. ระบบกรองข้อมูล (ค้นหาชื่อยา และ คัดเฉพาะยาในกระเป๋า)
  const medications: Medication[] = data || [];
  const filteredMeds = medications.filter((med) => {
    const matchSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKit = showOnlyKit ? myKit.includes(med.id) : true;
    return matchSearch && matchKit;
  });

  // 7. การแสดงผล UI หน้าหลัก
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        <input
          type="text"
          placeholder="ค้นหาชื่อยา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full sm:flex-1"
        />
        <label className="label cursor-pointer gap-3 self-end sm:self-center">
          <span className="label-text font-medium text-base ">
            เปิดดูกระเป๋ายา <span className="badge badge-primary badge-sm ml-1 w-4 ">{myKit.length}</span>
          </span>
          <input
            type="checkbox"
            checked={showOnlyKit}
            onChange={(e) => setShowOnlyKit(e.target.checked)}
            className="toggle toggle-primary"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMeds.map((med) => {
          const inKit = myKit.includes(med.id);
          return (
            <div
              key={med.id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200 flex flex-col justify-between"
            >
              <figure className="px-4 pt-4">
                <img
                  src={med.imageUrl}
                  alt={med.name}
                  className="rounded-lg h-40 w-full object-contain bg-base-200 p-2"
                  onError={(e) => {
                    // กรณีหาไฟล์รูปไม่เจอ ให้สลับไปใช้สีเทาแทน
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                  }}
                />
              </figure>
              <div className="card-body p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="badge badge-outline badge-sm mb-2">{med.category}</div>
                  <h3 className="card-title text-lg text-primary">{med.name}</h3>
                  <p className="text-sm text-base-content/80 mt-1 line-clamp-2" title={med.use}>
                    {med.use}
                  </p>
                </div>
                
                <div className="card-actions justify-between items-center mt-4 pt-3 border-t border-base-200">
                  <button
                    onClick={() => toggleKit(med.id)}
                    className={`btn btn-sm ${inKit ? 'btn-success text-white' : 'btn-outline'}`}
                  >
                    {inKit ? '✓ มีในกระเป๋า' : '+ เพิ่มลงกระเป๋า'}
                  </button>
                  
                  <Link to={`/medication/${med.id}`} className="text-sm font-medium text-primary hover:underline">
                    ดูข้อมูล →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* กรณีค้นหาไม่เจอ */}
        {filteredMeds.length === 0 && (
          <div className="col-span-full py-12 text-center text-base-content/50">
            ไม่พบข้อมูลยาที่คุณค้นหา
          </div>
        )}
      </div>
    </div>
  );
};