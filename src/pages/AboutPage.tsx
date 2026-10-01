import React from 'react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      id: '1650701343',
      name: 'นายณัฐชนน ด่านกิจยิ่งยง',
      nickname: 'เอฟ',
      role: 'Frontend & UI/UX (ทำหน้าหลัก และ Routing)',
      img: 'https://placehold.co/150x150?text=Member+1',
    },
    {
      id: '1660701648',
      name: 'นายณัฐภพ สมิทธินันต์',
      nickname: 'เต้',
      role: 'State Management (Zustand & TanStack Query)',
      img: 'https://placehold.co/150x150?text=Member+2',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">ทีมผู้จัดทำ</h1>
        <p className="text-base-content/70">Mini Project 2 - Modern Decoupled SPA</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="card bg-base-100 shadow-lg border border-base-200 items-center text-center p-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={member.img} alt={member.name} />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="card-title text-xl">{member.name} ({member.nickname})</h2>
              <p className="font-mono text-sm text-primary">{member.id}</p>
              <p className="text-sm text-base-content/80 mt-2"><b>หน้าที่:</b> {member.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card bg-base-200 p-6 mt-8">
        <h3 className="font-bold text-lg mb-2">ข้อมูลอ้างอิง (Data Attribution)</h3>
        <p className="text-sm text-base-content/80">
          ข้อมูลยาทั้งหมดภายในแอปพลิเคชันนี้อ้างอิงมาจากอินโฟกราฟิกของ <b>@pharmacology.studies</b> บน Instagram
          โดยนำมาจัดทำเป็น Mock JSON Data Server เพื่อใช้สำหรับการศึกษาในรายวิชา CS319 เท่านั้น
        </p>
      </div>
    </div>
  );
};