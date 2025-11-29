'use client';

import { useState } from 'react';
import { FormField } from '@/lib/types';
import { submissionsAPI } from '@/lib/api';
import ImageUpload from './ImageUpload';
import { Loader2, CheckCircle } from 'lucide-react';

interface DynamicFormRendererProps {
  formId: string;
  title: string;
  description: string;
  fields: FormField[];
  shareableLink: string;
}

export default function DynamicFormRenderer({
  formId,
  title,
  description,
  fields,
  shareableLink
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.id];

      // Check required fields
      if (field.required && (!value || value === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Validate email
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Please enter a valid email';
        }
      }

      // Validate number
      if (field.type === 'number' && value) {
        if (isNaN(Number(value))) {
          newErrors[field.id] = 'Please enter a valid number';
        }
        if (field.validation?.min && Number(value) < field.validation.min) {
          newErrors[field.id] = `Minimum value is ${field.validation.min}`;
        }
        if (field.validation?.max && Number(value) > field.validation.max) {
          newErrors[field.id] = `Maximum value is ${field.validation.max}`;
        }
      }

      // Validate text length
      if ((field.type === 'text' || field.type === 'textarea') && value) {
        if (field.validation?.min && value.length < field.validation.min) {
          newErrors[field.id] = `Minimum length is ${field.validation.min} characters`;
        }
        if (field.validation?.max && value.length > field.validation.max) {
          newErrors[field.id] = `Maximum length is ${field.validation.max} characters`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await submissionsAPI.submitForm(shareableLink, formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you for your submission!
        </h2>
        <p className="text-gray-600">
          Your response has been recorded successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === 'email' && (
              <input
                type="email"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                min={field.validation?.min}
                max={field.validation?.max}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            )}

            {field.type === 'date' && (
              <input
                type="date"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.type === 'select' && (
              <select
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={formData[field.id] === option}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(formData[field.id] || []).includes(option)}
                      onChange={(e) => {
                        const current = formData[field.id] || [];
                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((v: string) => v !== option);
                        handleChange(field.id, updated);
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === 'file' && (
              <ImageUpload
                currentImage={formData[field.id]}
                onUploadComplete={(url) => handleChange(field.id, url)}
                onRemove={() => handleChange(field.id, '')}
              />
            )}

            {errors[field.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Form</span>
          )}
        </button>
      </form>
    </div>
  );
}
