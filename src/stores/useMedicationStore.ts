import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// กำหนด Type สำหรับ State และ Action
interface MedicationState {
  myKit: string[]; // เก็บเฉพาะ Array ของ ID ยา (Client State)
  toggleKit: (id: string) => void; // ฟังก์ชันสำหรับเพิ่มลบยาออกจากกระเป๋า
}

// สร้าง Store ด้วย create() และห่อด้วย persist() เพื่อบันทึกลง LocalStorage
export const useMedicationStore = create<MedicationState>()(
  persist(
    (set) => ({
      myKit: [], // ค่าเริ่มต้นคือเป็นค่าว่างเปล่า

      // Action: ถ้ามี id ยานี้อยู่แล้วให้เอาออก (ลบ) ถ้ายังไม่มีให้เพิ่มเข้าไป
      toggleKit: (id) =>
        set((state) => ({
          myKit: state.myKit.includes(id)
            ? state.myKit.filter((medId) => medId !== id)
            : [...state.myKit, id],
        })),
    }),
    {
      name: 'medical-kit-storage', // ชื่อ Key ที่จะถูกบันทึกใน LocalStorage
    }
  )
);