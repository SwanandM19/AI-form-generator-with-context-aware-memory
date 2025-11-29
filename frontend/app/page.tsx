// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
import Link from 'next/link';
import { Sparkles, Zap, Share2, BarChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Generate Forms with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create dynamic, shareable forms in seconds using natural language.
          AI-powered with context-aware memory that learns from your past forms.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">AI-Powered</h3>
          <p className="text-gray-600 text-sm">
            Describe your form in plain English and let AI generate the perfect schema
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Zap className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">Context-Aware</h3>
          <p className="text-gray-600 text-sm">
            AI learns from your past forms and provides intelligent suggestions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Share2 className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">Easy Sharing</h3>
          <p className="text-gray-600 text-sm">
            Get shareable links instantly for your generated forms
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <BarChart className="w-12 h-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">Track Submissions</h3>
          <p className="text-gray-600 text-sm">
            View and manage all form submissions from your dashboard
          </p>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Try These Example Prompts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-800">
              "I need a job application form with name, email, resume upload, and cover letter"
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-800">
              "Create a customer feedback survey with rating scale and comments"
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-800">
              "Make an event registration form with photo ID upload and dietary preferences"
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-gray-800">
              "Generate a medical intake form with patient history and insurance details"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
