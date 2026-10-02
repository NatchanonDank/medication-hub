import { useParams, Link } from 'react-router';
import { useMedicationDetail, useMyKit } from '../hooks/useMedications';

export const MedicationDetailPage = () => {
  const { id } = useParams();
  
  // ดึงข้อมูลยาจาก React Query
  const { data: medication, isLoading, isError } = useMedicationDetail(id);
  
  // ดึงฟังก์ชันจัดการกระเป๋ายาจาก LocalStorage
  const { isInKit, toggleMyKit } = useMyKit();

  // แสดง Loading Spinner ระหว่างรอข้อมูล
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // กรณีหาไม่เจอ หรือ Error
  if (isError || !medication) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-2xl font-bold text-error mb-4">ไม่พบข้อมูลยาที่คุณค้นหา</h2>
        <Link to="/" className="btn btn-primary">กลับไปหน้าหลัก</Link>
      </div>
    );
  }

  // เช็คว่ายาตัวนี้อยู่ในกระเป๋าหรือยัง
  const inKit = isInKit(String(medication.id));

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-end">
        <Link to="/" className="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content px-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับไปหน้ารายการยา
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-base-100 p-6 sm:p-10 rounded-2xl shadow-sm border border-base-200">        
        <div className="w-full lg:w-1/3 flex flex-col gap-4 min-w-0">
          <div className="bg-transparent p-6 rounded-xl flex justify-center items-center h-64 sm:h-80">
            <img 
              src={medication.imageUrl} 
              alt={medication.name} 
              className="max-w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <button 
            onClick={() => toggleMyKit(medication)}
            className={`btn w-full shadow-sm ${inKit ? 'btn-error' : 'btn-primary'}`}
          >
            {inKit ? 'ลบออกจากกระเป๋ายา' : '+ เพิ่มลงกระเป๋ายา'}
          </button>

          {medication.pregnancyCategory && (
            <div className="bg-base-200/50 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-base-200 mt-2">
              <span className="text-sm font-semibold text-base-content/80">
                Pregnancy Category
              </span>
              <span className="badge badge-secondary badge-lg font-bold h-auto py-2 px-3 text-center leading-snug max-w-full text-wrap">
                {medication.pregnancyCategory}
              </span>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6 min-w-0">          
          <div className="border-b border-base-200 pb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="badge badge-primary badge-lg px-4 py-4 font-bold text-sm shadow-sm">
                {medication.category}
              </div>
              
              {medication.prescriptionType && (
                <span className="badge badge-warning badge-outline font-semibold px-3.5 py-3 border-2 shadow-sm">
                  {medication.prescriptionType}
                </span>
              )}
              {medication.specialTag && (
                <span className="badge badge-info badge-outline font-semibold px-3.5 py-3 border-2 shadow-sm">
                  {medication.specialTag}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-base-content flex items-baseline gap-3 flex-wrap">
              {medication.name}
              {medication.strength && (
                <span className="text-xl sm:text-2xl font-medium text-base-content/50">
                  ({medication.strength})
                </span>
              )}
            </h1>
            
            <h2 className="text-base sm:text-lg text-base-content/80 mt-3 flex items-center gap-2 flex-wrap">
              {medication.brandName && (
                <span className="font-semibold text-info">{medication.brandName}</span>
              )}
              
              {medication.brandName && medication.genericName && (
                <span className="text-base-content/30">•</span>
              )}
              
              <span>{medication.genericName}</span>
              
              {medication.dosageForm && (
                <>
                  <span className="text-base-content/30">•</span>
                  <span className="text-base-content/60">{medication.dosageForm}</span>
                </>
              )}

              {medication.appearance && (
                <>
                  <span className="text-base-content/30">•</span>
                  <span className="text-base-content/70 italic">ลักษณะยา: {medication.appearance}</span>
                </>
              )}
            </h2>
          </div>

          {medication.dosageInstruction && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-primary">ขนาดและวิธีใช้</h4>
                <p className="text-base-content/90 text-sm sm:text-base mt-1">{medication.dosageInstruction}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">        
            <div className="bg-info/5 border border-info/20 p-5 rounded-xl flex flex-col">
              <h3 className="font-bold text-lg text-info flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ข้อบ่งใช้ (Indications)
              </h3>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-base-content/80 text-sm sm:text-base flex-1">
                {medication.indications?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-warning/5 border border-warning/20 p-5 rounded-xl flex flex-col">
              <h3 className="font-bold text-lg text-warning flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                ผลข้างเคียง (Side Effects)
              </h3>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-base-content/80 text-sm sm:text-base flex-1">
                {medication.sideEffects?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <div className="bg-error/10 border border-error/20 p-5 sm:p-6 rounded-xl">
                <h3 className="font-bold text-lg text-error flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  คำเตือนและข้อควรระวัง (Warnings)
                </h3>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-base-content/90 text-sm sm:text-base">
                  {medication.warnings?.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {medication.interactions && medication.interactions.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  ยาที่ควรระวังการใช้ร่วมกัน (Interactions)
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {medication.interactions.map((item: string, idx: number) => (
                    <span key={idx} className="badge badge-outline border-base-300 text-base-content/80 py-3 px-3 shadow-sm bg-base-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};