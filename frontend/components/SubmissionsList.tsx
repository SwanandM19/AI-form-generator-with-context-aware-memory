'use client';

import { FormWithSubmissions } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useState } from 'react';

interface SubmissionsListProps {
  data: FormWithSubmissions[];
}

export default function SubmissionsList({ data }: SubmissionsListProps) {
  const [expandedForms, setExpandedForms] = useState<Set<string>>(new Set());

  const toggleForm = (formId: string) => {
    setExpandedForms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(formId)) {
        newSet.delete(formId);
      } else {
        newSet.add(formId);
      }
      return newSet;
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((formData) => (
        <div key={formData.formId} className="bg-white rounded-lg shadow border">
          <button
            onClick={() => toggleForm(formData.formId)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.formTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  {formData.submissionCount} submissions
                </p>
              </div>
            </div>
            {expandedForms.has(formData.formId) ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedForms.has(formData.formId) && (
            <div className="border-t">
              {formData.submissions.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">No submissions yet</p>
              ) : (
                <div className="divide-y">
                  {formData.submissions.map((submission) => (
                    <div key={submission._id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm text-gray-500">
                          Submitted {formatDate(submission.submittedAt)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(submission.responses).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {key}
                            </p>
                            {typeof value === 'string' && value.startsWith('http') ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View uploaded file
                              </a>
                            ) : Array.isArray(value) ? (
                              <p className="text-gray-900">{value.join(', ')}</p>
                            ) : (
                              <p className="text-gray-900">{String(value)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
