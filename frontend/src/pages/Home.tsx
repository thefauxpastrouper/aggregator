import { useEffect, useState } from 'react';
import NoticeCard, { type Notice } from '../components/NoticeCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_URL}/api/notices`)
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const duNotices = notices.filter(n => n.university === 'DU');
  const jnuNotices = notices.filter(n => n.university === 'JNU');
  const bhuNotices = notices.filter(n => n.university === 'BHU');

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          University Notices Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Stay updated with the latest announcements from DU, JNU, and BHU.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* DU Column */}
        <div className="flex flex-col w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3">
            <h2 className="text-lg font-semibold text-white">Delhi University</h2>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[700px] overflow-y-auto bg-gray-50/50">
            {duNotices.length > 0 ? duNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            )) : <p className="text-gray-500 text-sm text-center py-4">No recent notices found.</p>}
          </div>
        </div>

        {/* JNU Column */}
        <div className="flex flex-col w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <h2 className="text-lg font-semibold text-white">JNU</h2>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[700px] overflow-y-auto bg-gray-50/50">
            {jnuNotices.length > 0 ? jnuNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            )) : <p className="text-gray-500 text-sm text-center py-4">No recent notices found.</p>}
          </div>
        </div>

        {/* BHU Column */}
        <div className="flex flex-col w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
            <h2 className="text-lg font-semibold text-white">BHU</h2>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[700px] overflow-y-auto bg-gray-50/50">
            {bhuNotices.length > 0 ? bhuNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            )) : <p className="text-gray-500 text-sm text-center py-4">No recent notices found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
