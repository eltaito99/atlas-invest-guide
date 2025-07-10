-- Add support for cryptocurrency symbols in holdings table
ALTER TABLE public.holdings ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'stock' CHECK (asset_type IN ('stock', 'crypto'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_holdings_asset_type ON public.holdings(asset_type);