import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the main public lead capture page
  return <Navigate to="/" replace />;
};

export default Index;
