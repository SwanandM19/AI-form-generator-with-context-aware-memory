'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormGenerator from '@/components/FormGenerator';

export default function CreatePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FormGenerator />
    </div>
  );
}
