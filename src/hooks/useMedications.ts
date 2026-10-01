import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Medication } from '../types/medication';
import mockData from '../data/mock-medications.json';

// จำลองการดึงข้อมูลจาก API (หน่วงเวลา 800ms เพื่อให้โชว์ Loading Skeleton)
const fetchMedications = async (): Promise<Medication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData as Medication[]);
    }, 800);
  });
};

// 1. Hook สำหรับดึงข้อมูลยาทั้งหมด (ใช้ที่หน้าหลัก)
export const useMedications = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    staleTime: 1000 * 60 * 5, // กำหนดแคชข้อมูลไว้ 5 นาที
  });
};

// 2. Hook สำหรับดึงข้อมูลยารายตัว
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
      // ดึงข้อมูลจากแคช medications มาแสดงทันทีระหว่างรอโหลด Stale-While-Revalidate
      const allMeds = queryClient.getQueryData<Medication[]>(['medications']);
      return allMeds?.find((m) => String(m.id) === String(id));
    },
    enabled: !!id, // จะทำงานก็ต่อเมื่อมี id ส่งเข้ามาเท่านั้น
    staleTime: 1000 * 60 * 10, // แคชหน้ารายละเอียดไว้ 10 นาที
  });
};