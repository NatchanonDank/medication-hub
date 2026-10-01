import React from 'react';
import { useParams, Link } from 'react-router';
import { useMedicationDetail } from '../hooks/useMedications';
import { useMedicationStore } from '../stores/useMedicationStore';

export const MedicationDetailPage: React.FC = () => {
  // 1. ดึง ID จาก URL
  const { id } = useParams<{ id: string }>();
  // 2. ดึงข้อมูลรายละเอียดจาก Server State
  const { data: med, isLoading, isError, error, refetch } = useMedicationDetail(id);
  // 3. ดึง State กระเป๋ายาจาก Zustand
  const { myKit, toggleKit } = useMedicationStore();
  // 4. สถานะกำลังโหลดโชว์ Skeleton
  if (isLoading) {
    return (
      <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl border border-base-200 p-6 space-y-6 my-8">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-10 w-3/4 rounded" />
        <div className="skeleton h-64 w-full rounded-lg" />
        <div className="skeleton h-6 w-full rounded" />
        <div className="skeleton h-6 w-5/6 rounded" />
        <div className="skeleton h-12 w-48 rounded-lg" />
      </div>
    );
  }
  // 5. สถานะ Error หรือหาไม่เจอ
  if (isError || !med) {
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg flex flex-col items-center text-center">
        <div>
          <h3 className="font-bold text-lg">ไม่พบข้อมูลยา</h3>
          {error && <p className="text-sm mt-1">{(error as Error).message}</p>}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => refetch()} className="btn btn-sm btn-primary">ลองใหม่</button>
          <Link to="/" className="btn btn-sm btn-ghost">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const inKit = myKit.includes(med.id);

  // 6. แสดงผลหน้ารายละเอียด
  return (
    <div className="card max-w-2xl mx-auto bg-base-100 shadow-2xl border border-base-200 p-6 my-8">
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
          <span>← ย้อนกลับหน้ารายการ</span>
        </Link>
      </div>
      <div className="space-y-6">
        <div className="text-center">
          <div className="badge badge-primary badge-outline mb-3">{med.category}</div>
          <h1 className="text-3xl font-bold text-base-content">{med.name}</h1>
          <p className="text-lg text-base-content/70 mt-2">{med.use}</p>
        </div>

        <figure className="py-4 bg-base-200 rounded-xl">
          <img
            src={med.imageUrl}
            alt={med.name}
            className="max-h-80 object-contain mx-auto mix-blend-multiply"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </figure>

        <div className="bg-info/10 p-4 rounded-lg border border-info/20">
          <h3 className="font-semibold text-info-content mb-2">ข้อมูลเพิ่มเติม</h3>
          <p className="text-base-content/80 leading-relaxed">{med.description}</p>
        </div>

        <div className="pt-4 text-center border-t border-base-200">
          <button
            onClick={() => toggleKit(med.id)}
            className={`btn btn-wide shadow-md ${inKit ? 'btn-success text-white' : 'btn-primary'}`}
          >
            {inKit ? '✓ นำออกจากกระเป๋า' : '+ เพิ่มลงกระเป๋ายาส่วนตัว'}
          </button>
        </div>
      </div>
    </div>
  );
};