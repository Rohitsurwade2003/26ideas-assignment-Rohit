import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/forms/LoginForm';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;