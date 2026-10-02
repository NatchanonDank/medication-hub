import { useState, useMemo } from 'react';
import medications from '../data/mock-medications.json';
import MedicationCard from '../components/MedicationCard.tsx';

export const MedicationListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ดึงหมวดหมู่ทั้งหมดออกมาทำ Dropdown
  const categories = useMemo(() => {
    const cats = medications.map((m: any) => m.category);
    return ['All', ...new Set(cats)];
  }, []);

  // Filter/Sortข้อมูลยา
  const filteredAndSortedMeds = useMemo(() => {
    return medications
      .filter((med: any) => {
        // ค้นหาจากชื่อยาหลัก หรือ ชื่อสามัญทางยา
        const matchesSearch = 
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (med.genericName && med.genericName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // คัดกรองตามหมวดหมู่
        const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a: any, b: any) => {
        // จัดเรียง A-Z หรือ Z-A
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาชื่อยา หรือ ชื่อสามัญ..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="select select-bordered w-full md:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat: any) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'ทุกหมวดหมู่' : cat}
            </option>
          ))}
        </select>

        <button
          className="btn bg-base-100 border-base-300 text-base-content hover:bg-base-200 hover:border-base-content/50 w-full md:w-auto font-normal shadow-sm"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedMeds.length > 0 ? (
          filteredAndSortedMeds.map((med: any) => (
            <MedicationCard key={med.id} medication={med} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-base-content/50">
            <p className="text-xl font-semibold">ไม่พบข้อมูลยา</p>
            <p>ลองปรับคำค้นหาหรือเปลี่ยนหมวดหมู่ดูอีกครั้ง</p>
          </div>
        )}
      </div>

    </div>
  );
}