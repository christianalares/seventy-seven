export const seed = `CREATE OR REPLACE FUNCTION public.create_user_and_team()
RETURNS TRIGGER as $$

DECLARE
  v_team_id UUID;

BEGIN
  -- Insert into public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    image_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Insert into public.teams and return the team_id
  INSERT INTO public.teams (
    name
  )
  VALUES (
    NEW.raw_user_meta_data->>'full_name'
  )
  -- Capture the id into v_team_id here
  RETURNING id INTO v_team_id;

  -- Insert into public.users_on_teams using the captured team_id
  INSERT INTO public.users_on_teams (
    user_id,
    team_id,
    role
  )
  VALUES (
    NEW.id,
    -- Use the captured v_team_id here
    v_team_id,
    'OWNER'
  );

  RETURN NEW;
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;


create trigger on_user_signup after insert on auth.users for each row execute function create_user_and_team()`
