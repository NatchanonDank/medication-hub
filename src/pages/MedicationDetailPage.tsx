import React from 'react';
import { useParams, Link } from 'react-router';
import { useMedicationDetail } from '../hooks/useMedications';
import { useMedicationStore } from '../stores/useMedicationStore';

export const MedicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: med, isLoading, isError, error, refetch } = useMedicationDetail(id);
  const { myKit, toggleKit } = useMedicationStore();

  if (isLoading) {
    return (
      <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl border border-base-200 p-6 space-y-6 my-8">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-10 w-3/4 rounded mx-auto" />
        <div className="skeleton h-64 w-full rounded-lg" />
        <div className="skeleton h-12 w-48 rounded-lg mx-auto" />
      </div>
    );
  }

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

  return (
    <div className="card max-w-2xl mx-auto bg-base-100 shadow-2xl border border-base-200 p-6 my-8 text-center">
      <div className="mb-4 text-left">
        <Link to="/" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
          ← ย้อนกลับหน้ารายการ
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <div className="badge badge-primary badge-outline mb-2">{med.category}</div>
          <h1 className="text-3xl font-bold text-white">{med.name}</h1>
          <p className="text-base text-white/70 mt-1">{med.use}</p>
        </div>

        <figure className="py-4 bg-base-200/30 rounded-xl">
          <img
            src={med.imageUrl}
            alt={med.name}
            className="max-h-72 object-contain mx-auto" // ลบ mix-blend-multiply ออก
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </figure>

        <div className="collapse collapse-arrow border border-base-300 bg-base-100/50 rounded-box text-left">
          <input type="checkbox" defaultChecked /> 
          <div className="collapse-title text-lg font-semibold text-purple-400 text-center">
            ข้อมูลเพิ่มเติม
          </div>
          <div className="collapse-content"> 
            <p className="text-white/90 leading-relaxed text-center">
              {med.description}
            </p>
          </div>
        </div>

        <div className="pt-2">
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