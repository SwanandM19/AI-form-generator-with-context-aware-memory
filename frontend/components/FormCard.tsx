'use client';

import { Form } from '@/lib/types';
import { formatDate, copyToClipboard, getFormShareUrl } from '@/lib/utils';
import { ExternalLink, Copy, Trash2, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface FormCardProps {
  form: Form;
  onDelete: (id: string) => void;
}

export default function FormCard({ form, onDelete }: FormCardProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = getFormShareUrl(form.shareableLink);

  const handleCopy = async () => {
    await copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this form?')) {
      onDelete(form._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{form.title}</h3>
          {form.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {form.purpose}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>{form.schema.length} fields</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{form.submissionCount} submissions</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Created {formatDate(form.createdAt)}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition text-sm"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        <Link
          href={`/form/${form.shareableLink}`}
          target="_blank"
          className="flex items-center justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
