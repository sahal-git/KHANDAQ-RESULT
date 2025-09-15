/*
          # Create Program Status Table
          This migration creates a new table `program_status` to manage the publication state of competition programs.

          ## Query Description: 
          This operation creates a new table `program_status` to track whether a program's results are public. It includes columns for the program code, a boolean `is_published` flag, and a timestamp for the last update. It also sets up Row Level Security (RLS) to control access. There is no risk to existing data as this is a new table.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table created: `public.program_status`
          - Columns: `program_code` (TEXT, PK), `is_published` (BOOLEAN), `updated_at` (TIMESTAMPTZ)
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Policies are created for both `authenticated` and `anon` roles. Admins (authenticated) have full control, while the public (anon) can only read published statuses.
          
          ## Performance Impact:
          - Indexes: A primary key index is automatically created on `program_code`.
          - Triggers: None.
          - Estimated Impact: Low. This is a small lookup table.
          */

CREATE TABLE public.program_status (
  program_code TEXT PRIMARY KEY NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

comment on table public.program_status is 'Tracks the publication status of each program.';

-- Enable RLS
ALTER TABLE public.program_status ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all program statuses"
ON public.program_status
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view published program statuses"
ON public.program_status
FOR SELECT
TO anon
USING (is_published = true);
