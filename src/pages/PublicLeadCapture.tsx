import { PublicHeader } from '@/components/layout/PublicHeader';
import { MainContainer } from '@/components/layout/MainContainer';
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm';

const PublicLeadCapture = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      <PublicHeader />
      
      <main className="pt-20 pb-12">
        <MainContainer>
          <div className="text-center mb-8">
            <h1 className="text-h1 text-text-primary font-bold mb-4">
              Automate Your Ambitions
            </h1>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Tell us about your automation needs. Our AI-powered system will analyze your challenge and help us design the perfect solution.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <LeadCaptureForm />
          </div>
        </MainContainer>
      </main>
    </div>
  );
};

export default PublicLeadCapture;