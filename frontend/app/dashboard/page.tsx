'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formsAPI, submissionsAPI } from '@/lib/api';
import { Form, FormWithSubmissions } from '@/lib/types';
import FormCard from '@/components/FormCard';
import SubmissionsList from '@/components/SubmissionsList';
import { Loader2, FileText, Send, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<FormWithSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [formsRes, submissionsRes] = await Promise.all([
        formsAPI.getUserForms(),
        submissionsAPI.getAllUserSubmissions()
      ]);

      setForms(formsRes.data.forms);
      setSubmissions(submissionsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (id: string) => {
    try {
      await formsAPI.deleteForm(id);
      setForms(forms.filter(f => f._id !== id));
    } catch (error) {
      console.error('Failed to delete form:', error);
      alert('Failed to delete form');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your forms and submissions</p>
        </div>
        <Link
          href="/create"
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Form</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Forms</p>
              <p className="text-3xl font-bold text-gray-900">{forms.length}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">
                {forms.reduce((sum, f) => sum + f.submissionCount, 0)}
              </p>
            </div>
            <Send className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. per Form</p>
              <p className="text-3xl font-bold text-gray-900">
                {forms.length > 0 
                  ? Math.round(forms.reduce((sum, f) => sum + f.submissionCount, 0) / forms.length)
                  : 0}
              </p>
            </div>
            <Send className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('forms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'forms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Forms ({forms.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submissions
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'forms' ? (
            forms.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI-powered form</p>
                <Link
                  href="/create"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Form</span>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    onDelete={handleDeleteForm}
                  />
                ))}
              </div>
            )
          ) : (
            <SubmissionsList data={submissions} />
          )}
        </div>
      </div>
    </div>
  );
}
