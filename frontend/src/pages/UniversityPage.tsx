import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NoticeCard, { type Notice } from '../components/NoticeCard';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function UniversityPage() {
  const { university } = useParams<{ university: string }>();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizedName = university?.toUpperCase() || 'DU';
  
  const uniDetails: Record<string, { title: string; color: string; bg: string; link: string }> = {
    'DU': { title: 'Delhi University', color: 'text-emerald-700', bg: 'bg-emerald-50', link: 'https://www.du.ac.in/' },
    'JNU': { title: 'Jawaharlal Nehru University', color: 'text-blue-700', bg: 'bg-blue-50', link: 'https://www.jnu.ac.in/' },
    'BHU': { title: 'Banaras Hindu University', color: 'text-orange-700', bg: 'bg-orange-50', link: 'https://www.bhu.ac.in/' }
  };
  
  const details = uniDetails[normalizedName] || uniDetails['DU'];

  useEffect(() => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_URL}/api/notices?university=${normalizedName}`)
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [normalizedName]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>
      
      <div className={`p-8 rounded-2xl mb-8 ${details.bg} border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${details.color} sm:text-4xl mb-2`}>
            {details.title}
          </h1>
          <p className="text-gray-600">Latest notices, announcements, and important links.</p>
        </div>
        <a 
          href={details.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg font-medium text-gray-700 shadow-sm hover:shadow border border-gray-200 transition-all hover:text-emerald-600"
        >
          Official Website <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">All Notices ({notices.length})</h2>
        </div>
        <div className="p-6">
          {notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No notices found for {details.title}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
