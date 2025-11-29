// 'use client';

// import { useState } from 'react';
// import { formsAPI } from '@/lib/api';
// import { Loader2, Sparkles } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function FormGenerator() {
//   const router = useRouter();
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleGenerate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!prompt.trim()) {
//       setError('Please enter a prompt');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await formsAPI.generateForm(prompt);
//       const form = response.data.form;
      
//       // Redirect to dashboard or show success
//       router.push('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.error || 'Failed to generate form');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-lg shadow-lg p-8">
//         <div className="flex items-center space-x-2 mb-6">
//           <Sparkles className="w-6 h-6 text-purple-500" />
//           <h2 className="text-2xl font-bold">Generate Form with AI</h2>
//         </div>

//         <form onSubmit={handleGenerate} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Describe your form
//             </label>
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="E.g., I need a job application form with name, email, resume upload, and cover letter"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               rows={4}
//               disabled={loading}
//             />
//           </div>

//           {error && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 <span>Generating...</span>
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-5 h-5" />
//                 <span>Generate Form</span>
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//           <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
//           <ul className="text-sm text-blue-800 space-y-1">
//             <li>• Be specific about field types (text, email, file upload, etc.)</li>
//             <li>• Mention if you need image uploads or file attachments</li>
//             <li>• Describe the purpose clearly (job form, survey, registration)</li>
//             <li>• AI will learn from your previous forms to make better suggestions!</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { formsAPI } from '@/lib/api';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FormGenerator() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await formsAPI.generateForm(prompt);
      const form = response.data.form;
      
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Form generation error:', err);
      
      // FIX: Handle token expiry
      if (err.response?.status === 401) {
        // Token expired - clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }
      
      setError(err.response?.data?.error || 'Failed to generate form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold">Generate Form with AI</h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your form
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., I need a job application form with name, email, resume upload, and cover letter"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Form</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about field types (text, email, file upload, etc.)</li>
            <li>• Mention if you need image uploads or file attachments</li>
            <li>• Describe the purpose clearly (job form, survey, registration)</li>
            <li>• AI will learn from your previous forms to make better suggestions!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
