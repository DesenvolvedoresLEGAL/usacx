-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('agent', 'manager', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create teams table for organizational hierarchy
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create agent_profiles table for extended data
CREATE TABLE public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  display_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on agent_profiles
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for teams
CREATE POLICY "Users can view their own team"
  ON public.teams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agent_profiles
      WHERE agent_profiles.user_id = auth.uid()
      AND agent_profiles.team_id = teams.id
    ) OR manager_id = auth.uid()
  );

CREATE POLICY "Managers can view their teams"
  ON public.teams
  FOR SELECT
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage teams"
  ON public.teams
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for agent_profiles
CREATE POLICY "Users can view their own profile"
  ON public.agent_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.agent_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team profiles"
  ON public.agent_profiles
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'manager') AND
    team_id IN (
      SELECT id FROM public.teams WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all profiles"
  ON public.agent_profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles"
  ON public.agent_profiles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically create agent profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.agent_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_profiles_updated_at
  BEFORE UPDATE ON public.agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();