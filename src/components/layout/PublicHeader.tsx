import { useNavigate } from 'react-router-dom';
import { MainContainer } from './MainContainer';
import { Button } from '../ui/button';

export const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-background-secondary border-b border-border-primary fixed top-0 left-0 right-0 z-50">
      <MainContainer>
        <div className="flex items-center justify-between h-16">
          <h1 className="text-h3 text-text-primary font-semibold">
            26ideas AI Qualifier
          </h1>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="border-border-primary text-text-primary hover:bg-background-tertiary"
          >
            Admin Login
          </Button>
        </div>
      </MainContainer>
    </header>
  );
};