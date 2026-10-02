import { useParams, useNavigate } from 'react-router';
import medications from '../data/mock-medications.json';
import { useMedicationStore } from '../stores/useMedicationStore';

export const MedicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { myKit, toggleKit } = useMedicationStore();
  
  const medication: any = medications.find((med: any) => String(med.id) === String(id));

  if (!medication) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-error">ไม่พบข้อมูลยานี้</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
          ย้อนกลับ
        </button>
      </div>
    );
  }

  const isInKit = myKit.includes(medication.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-200">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-base-200 bg-base-100/50">
            <img 
              src={medication.imageUrl} 
              alt={medication.name} 
              className="max-w-full h-auto object-contain rounded-xl max-h-80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/400x300?text=${medication.name}`;
              }}
            />
          </div>

          <div className="md:w-3/5 p-6 md:p-10 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {medication.category}
              </span>
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-sm btn-ghost text-base-content/70 hover:text-base-content"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ย้อนกลับ
              </button>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                {medication.name}
              </h1>
              <p className="text-base text-base-content/70 mt-1 font-medium">
                {medication.use}
              </p>

              {medication.badges && medication.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {medication.badges.map((badge: string, index: number) => {
                    const isDanger = badge.includes("อันตราย") || badge.includes("ห้าม") || badge.includes("ระวัง");
                    const isRx = badge === "Rx";
                    const badgeColor = isDanger ? "badge-error text-white border-none" : isRx ? "badge-warning text-white border-none" : "badge-info text-white border-none";
                    return (
                      <span key={index} className={`badge badge-sm py-2 px-3 font-medium shadow-sm ${badgeColor}`}>
                        {badge}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="divider my-0"></div>
            <div className="py-4 space-y-3">
              <div>
                <h3 className="font-bold text-sm text-base-content">สรรพคุณ:</h3>
                <p className="text-sm text-base-content/80 mt-0.5">{medication.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content/80 pt-1">
                <div>
                  <strong className="text-base-content text-xs uppercase tracking-wide text-base-content/60 block">ชื่อสามัญทางยา</strong>
                  <span className="font-medium">{medication.genericName || "-"}</span>
                </div>
                <div>
                  <strong className="text-base-content text-xs uppercase tracking-wide text-base-content/60 block">ลักษณะยา</strong>
                  <span className="font-medium">{medication.appearance || "-"}</span>
                </div>
              </div>
            </div>

            {medication.dosage && (
              <div className="alert alert-info shadow-sm rounded-lg mb-3 text-left flex items-start py-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <h4 className="font-bold text-sm">ขนาดและวิธีใช้</h4>
                  <div className="text-xs mt-0.5">{medication.dosage}</div>
                </div>
              </div>
            )}
            {medication.sideEffects && medication.sideEffects.length > 0 && (
              <div className="alert alert-warning shadow-sm rounded-lg mb-3 text-left flex items-start py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h4 className="font-bold text-sm">ผลข้างเคียงที่อาจเกิดขึ้น</h4>
                  <ul className="list-disc list-inside text-xs mt-0.5 space-y-0.5">
                    {medication.sideEffects.map((effect: string, idx: number) => (
                      <li key={idx}>{effect}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {medication.warnings && medication.warnings.length > 0 && (
              <div className="alert alert-error shadow-sm rounded-lg mb-3 text-left flex items-start py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <h4 className="font-bold text-sm">ข้อห้ามใช้ / คำเตือน</h4>
                  <ul className="list-disc list-inside text-xs mt-0.5 space-y-0.5">
                    {medication.warnings.map((warning: string, idx: number) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex gap-4">
              <button 
                onClick={() => toggleKit(medication.id)}
                className={`btn flex-1 shadow-md text-white border-none ${
                  isInKit ? 'bg-error hover:bg-error/80' : 'bg-primary hover:bg-primary/80'
                }`}
              >
                {isInKit ? '- ลบออกจากกระเป๋ายา' : '+ เพิ่มลงกระเป๋ายา'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};