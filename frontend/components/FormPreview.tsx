'use client';

import { FormField } from '@/lib/types';
import { Eye } from 'lucide-react';

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
}

export default function FormPreview({ title, description, fields }: FormPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-dashed border-blue-300">
      <div className="flex items-center space-x-2 mb-6 text-blue-600">
        <Eye className="w-5 h-5" />
        <span className="font-semibold">Preview Mode</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <div className="text-sm text-gray-500">
              Type: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{field.type}</span>
              {field.validation && (
                <span className="ml-4">
                  Validation: {JSON.stringify(field.validation)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
