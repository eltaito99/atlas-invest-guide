-- Create holdings table for user portfolio
CREATE TABLE public.holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(15,6) NOT NULL CHECK (shares > 0),
  purchase_price DECIMAL(15,2) NOT NULL CHECK (purchase_price > 0),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_price DECIMAL(15,2) DEFAULT 0,
  last_price_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create realized_gains table for closed positions
CREATE TABLE public.realized_gains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares_sold DECIMAL(15,6) NOT NULL CHECK (shares_sold > 0),
  purchase_price DECIMAL(15,2) NOT NULL,
  sale_price DECIMAL(15,2) NOT NULL,
  realized_gain DECIMAL(15,2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  original_holding_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realized_gains ENABLE ROW LEVEL SECURITY;

-- Create policies for holdings
CREATE POLICY "Users can view their own holdings" 
ON public.holdings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own holdings" 
ON public.holdings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings" 
ON public.holdings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings" 
ON public.holdings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for realized_gains
CREATE POLICY "Users can view their own realized gains" 
ON public.realized_gains 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own realized gains" 
ON public.realized_gains 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_holdings_updated_at
BEFORE UPDATE ON public.holdings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_holdings_user_id ON public.holdings(user_id);
CREATE INDEX idx_holdings_symbol ON public.holdings(symbol);
CREATE INDEX idx_realized_gains_user_id ON public.realized_gains(user_id);