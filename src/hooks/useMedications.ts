import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Medication } from '../types/medication';
import mockData from '../data/mock-medications.json';

// จำลองการดึงข้อมูลจาก API
const fetchMedications = async (): Promise<Medication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData as Medication[]);
    }, 800);
  });
};

// Hook สำหรับดึงข้อมูลยาทั้งหมด
export const useMedications = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    staleTime: 1000 * 60 * 5, // กำหนดแคชข้อมูลไว้ 5 นาที
  });
};

// Hook สำหรับดึงข้อมูลยารายตัว
export const useMedicationDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['medication', id],
    queryFn: async (): Promise<Medication> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const med = (mockData as Medication[]).find((m) => String(m.id) === String(id));
          if (med) {
            resolve(med);
          } else {
            reject(new Error('ไม่พบข้อมูลยาที่คุณค้นหา'));
          }
        }, 500); // หน่วงเวลาไว้ 500ms
      });
    },
    initialData: () => {
      // ดึงข้อมูลจากแคช medications มาแสดงทันทีระหว่างรอโหลด
      const allMeds = queryClient.getQueryData<Medication[]>(['medications']);
      return allMeds?.find((m) => String(m.id) === String(id));
    },
    enabled: !!id, // จะทำงานก็ต่อเมื่อมี id ส่งเข้ามาเท่านั้น
    staleTime: 1000 * 60 * 10, // แคชหน้ารายละเอียดไว้ 10 นาที
  });
};

// Hook สำหรับจัดการกระเป๋ายาด้วย LocalStorage
export const useMyKit = () => {
  const [myKit, setMyKit] = useState<Medication[]>([]);

  // โหลดข้อมูลกระเป๋ายาจาก localStorage
  useEffect(() => {
    const savedKit = localStorage.getItem('myMedKit');
    if (savedKit) {
      try {
        setMyKit(JSON.parse(savedKit));
      } catch (error) {
        console.error('Failed to parse myMedKit', error);
      }
    }
  }, []);

  const isInKit = (id: string) => {
    return myKit.some((med) => String(med.id) === String(id));
  };

  // ฟังก์ชันเพิ่ม/ลบ ยาออกจากกระเป๋า
  const toggleMyKit = (medication: Medication) => {
    let updatedKit;
    
    if (isInKit(String(medication.id))) {
      updatedKit = myKit.filter((med) => String(med.id) !== String(medication.id));
    } else {
      updatedKit = [...myKit, medication];
    }

    setMyKit(updatedKit);
    localStorage.setItem('myMedKit', JSON.stringify(updatedKit));
  };

  const clearMyKit = () => {
    setMyKit([]);
    localStorage.removeItem('myMedKit');
  };

  return {
    myKit,
    isInKit,
    toggleMyKit,
    clearMyKit
  };
};