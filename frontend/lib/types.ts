export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  accept?: string;
}

export interface Form {
  _id: string;
  title: string;
  description: string;
  purpose: string;
  schema: FormField[];
  shareableLink: string;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

export interface FormWithSubmissions {
  formId: string;
  formTitle: string;
  submissionCount: number;
  submissions: Submission[];
}
