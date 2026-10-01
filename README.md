# MedHub - Modern Decoupled SPA Medication Hub

Mini Project สำหรับรายวิชาพัฒนาเว็บแอปพลิเคชัน โดยใช้สถาปัตยกรรม Modern Decoupled Single Page Application (SPA)

---

## 👥 Team Members (ผู้จัดทำ)
* **นายณัฐชนน ด่านกิจยิ่งยง (เอฟ)** - รหัสนักศึกษา: `1650701343` (พัฒนาแอปพลิเคชันทั้งหมด: Frontend, Routing, State Management, UI/UX)
* **นายณัฏฐภพ สมิทธิธนันต์ (เต้)** - รหัสนักศึกษา: `1660701648` (จัดทำเอกสารประกอบโครงงาน / Documentation)

---

## 🚀 Tech Stack (เทคโนโลยีที่ใช้)
* **Framework:** React + Vite (TypeScript)
* **Styling & UI:** Tailwind CSS, DaisyUI (Dark Theme Aesthetic)
* **Routing:** React Router v7
* **Server State Management:** TanStack Query (กำหนด StaleTime 5 นาที พร้อมระบบ Caching)
* **Client State Management:** Zustand (พร้อมใช้ `persist` middleware บันทึกข้อมูลกระเป๋ายาลง LocalStorage)

---

## 📌 Features & Pages (ฟีเจอร์และหน้าหลักของแอปพลิเคชัน)
1. **Medication List Page (หน้าหลัก):** แสดงรายการยาทั้งหมด 48 ชนิด พร้อมระบบค้นหา (Search), ตัวกรองเฉพาะยาในกระเป๋า (My Kit Toggle) และระบบ Loading Skeleton
2. **Medication Detail Page (หน้ารายละเอียด):** แสดงข้อมูลเชิงลึกของยาแต่ละชนิด รูปภาพประกอบ และกล่องข้อความ "ข้อมูลเพิ่มเติม" (Collapse/Accordion)
3. **My Medical Kit Page (หน้ากระเป๋ายาส่วนตัว):** จัดการรายการยาที่ผู้ใช้เลือกเก็บไว้ในคอลเลกชันส่วนตัว ข้อมูลถูกบันทึกไว้อย่างถาวรผ่าน Zustand Persist
4. **Drug Interaction Checker Page (หน้าตรวจสอบปฏิกิริยาระหว่างยา):** ระบบจำลองการเลือกยา 2 ชนิดเพื่อวิเคราะห์และแจ้งเตือนความเสี่ยง (ระดับปลอดภัย เฝ้าระวัง และอันตรายรุนแรง)
5. **About Page (หน้าเกี่ยวกับเรา):** แสดงข้อมูลรายชื่อผู้จัดทำ รหัสนักศึกษา หน้าที่รับผิดชอบ และเครดิตแหล่งที่มาของข้อมูล (Data Attribution)

---

## 🛠️ Getting Started (วิธีรันโปรเจกต์ในเครื่อง)

1. **Clone Repository**
   ```bash
   git clone <URL_ของ_REPO>
   cd medication-hub
