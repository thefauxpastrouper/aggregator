import { FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';

export interface Notice {
  id: number;
  university: string;
  title: string;
  url: string;
  isPdf: boolean;
  date: string;
  summary?: string;
  createdAt: string;
}

export function isNew(dateStr: string) {
  const noticeDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - noticeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  // notices with respect to previous day should be marked new for the next two days
  return diffDays <= 2;
}

export default function NoticeCard({ notice }: { notice: Notice }) {
  const newBadge = isNew(notice.date || notice.createdAt);

  return (
    <a
      href={notice.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-emerald-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {notice.isPdf ? (
              <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                <FileText className="w-3 h-3 mr-1" /> PDF
              </span>
            ) : (
              <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <LinkIcon className="w-3 h-3 mr-1" /> Link
              </span>
            )}
            
            {newBadge && (
              <span className="animate-pulse flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
                NEW
              </span>
            )}
            
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(notice.date || notice.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-gray-800 font-medium group-hover:text-emerald-600 transition-colors line-clamp-2">
            {notice.title}
          </h3>
          {notice.summary && notice.summary !== notice.title && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {notice.summary}
            </p>
          )}
        </div>
        <div className="text-gray-400 group-hover:text-emerald-500 transition-colors mt-1">
          <ExternalLink className="w-5 h-5" />
        </div>
      </div>
    </a>
  );
}
