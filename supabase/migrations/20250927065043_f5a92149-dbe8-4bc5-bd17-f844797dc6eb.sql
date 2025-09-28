-- Create leads table for storing lead capture data
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  problem_text TEXT NOT NULL,
  fit_score INTEGER,
  fit_band TEXT,
  use_case_label TEXT,
  rationale TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (for lead capture form)
CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view all leads (for admin)
CREATE POLICY "Authenticated users can view all leads" 
ON public.leads 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update leads
CREATE POLICY "Authenticated users can update leads" 
ON public.leads 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();