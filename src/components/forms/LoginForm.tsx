import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } else {
        navigate('/admin');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-secondary p-8 rounded-lg w-full max-w-md">
      <h2 className="text-h2 text-text-primary mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-subtext text-text-secondary">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={loading}
          />
          {errors.email && <p className="text-sm text-status-error mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-subtext text-text-secondary">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="mt-1 bg-background-primary border-border-primary text-text-primary focus:border-accent-primary"
            disabled={loading}
          />
          {errors.password && <p className="text-sm text-status-error mt-1">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-primary hover:bg-accent-primary-hover text-white mt-6"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};