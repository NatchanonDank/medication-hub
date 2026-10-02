import { Link } from 'react-router';
import type { Medication } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
}

export default function MedicationCard({ medication }: MedicationCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200 p-6 flex flex-col h-full">
      <figure className="h-40 mb-4 bg-transparent flex items-center justify-center">
        <img 
          src={medication.imageUrl} 
          alt={medication.name} 
          className="max-h-full max-w-full object-contain rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/200x150?text=No+Image`;
          }}
        />
      </figure>
      <div className="flex flex-col flex-grow text-center">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {medication.category}
        </span>
        <h2 className="text-lg font-bold mt-1 text-base-content">
          {medication.name}
        </h2>
        <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
          {medication.use}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 justify-center items-center w-full">
          {medication.badges?.map((badge: string, index: number) => {
            const isDanger = badge.includes("อันตราย") || badge.includes("ห้าม") || badge.includes("ระวัง");
            const isRx = badge === "Rx";
            const badgeColor = isDanger ? "badge-error text-white border-none" : isRx ? "badge-warning text-white border-none" : "badge-info text-white border-none";

            return (
              <span key={index} className={`badge badge-sm py-2 px-2 font-medium shadow-sm ${badgeColor}`}>
                {badge}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-base-200/50 text-center">
        <Link 
          to={`/medication/${medication.id}`} 
          className="text-primary hover:text-primary-focus text-sm font-semibold inline-flex items-center gap-1"
        >
          ดูข้อมูล &rarr;
        </Link>
      </div>
    </div>
  );
}