'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formsAPI } from '@/lib/api';
import { Form } from '@/lib/types';
import DynamicFormRenderer from '@/components/DynamicFormRenderer';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PublicFormPage() {
  const params = useParams();
  const link = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [link]);

  const fetchForm = async () => {
    try {
      const response = await formsAPI.getFormByLink(link);
      setForm(response.data.form);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Form not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">{error || 'This form does not exist or has been deleted'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <DynamicFormRenderer
        formId={form._id}
        title={form.title}
        description={form.description}
        fields={form.schema}
        shareableLink={form.shareableLink}
      />
    </div>
  );
}
