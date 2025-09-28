import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email format'),
  company: z.string().trim().optional(),
  website: z.string().trim().optional(),
  problem_text: z.string().trim().min(30, 'Problem statement must be at least 30 characters'),
});

type FormData = z.infer<typeof leadSchema>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const LeadCaptureForm = () => {
  const { toast } = useToast();
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    website: '',
    problem_text: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrors({});

    try {
      // Validate form data
      const validatedData = leadSchema.parse(formData);

      // Submit to webhook
      const response = await fetch('https://ideas26.app.n8n.cloud/webhook/064f811e-f2ca-4a25-b2de-866ceedc71be', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || '',
          website: validatedData.website || '',
          problem_text: validatedData.problem_text,
        }),
      });

      if (!response.ok) {
        setFormStatus('error');
        toast({
          title: "Submission Failed",
          description: "Please try again.",
          variant: "destructive",
        });
      } else {
        setFormStatus('success');
        toast({
          title: "Thank you!",
          description: "We'll be in touch soon.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      setFormStatus('error');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="bg-background-secondary p-6 rounded-lg text-center">
        <h3 className="text-h3 text-text-primary mb-2">Thank you!</h3>
        <p className="text-body text-text-secondary">We'll be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-background-secondary p-6 rounded-lg space-y-4">
      {/* Name and Email side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-subtext text-text-secondary">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={formStatus === 'submitting'}
          />
          {errors.name && <p className="text-sm text-status-error mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-subtext text-text-secondary">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={formStatus === 'submitting'}
          />
          {errors.email && <p className="text-sm text-status-error mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Company and Website side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company" className="text-subtext text-text-secondary">Company</Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={formStatus === 'submitting'}
          />
        </div>

        <div>
          <Label htmlFor="website" className="text-subtext text-text-secondary">Website</Label>
          <Input
            id="website"
            type="text"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={formStatus === 'submitting'}
          />
        </div>
      </div>

      {/* Problem Statement full width */}
      <div>
        <Label htmlFor="problem_text" className="text-subtext text-text-secondary">Problem Statement *</Label>
        <Textarea
          id="problem_text"
          rows={6}
          placeholder="Tell us about your automation needs and challenges..."
          value={formData.problem_text}
          onChange={(e) => handleInputChange('problem_text', e.target.value)}
          className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary resize-none"
          disabled={formStatus === 'submitting'}
        />
        {errors.problem_text && <p className="text-sm text-status-error mt-1">{errors.problem_text}</p>}
      </div>

      <Button
        type="submit"
        disabled={formStatus === 'submitting'}
        className="w-full bg-accent-primary hover:bg-accent-primary-hover text-white"
      >
        {formStatus === 'submitting' ? 'Submitting...' : 'Submit Lead'}
      </Button>

      {formStatus === 'error' && (
        <p className="text-sm text-status-error text-center">
          Submission failed. Please try again.
        </p>
      )}
    </form>
  );
};