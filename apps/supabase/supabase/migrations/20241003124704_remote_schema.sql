
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."TEAM_ROLE_ENUM" AS ENUM (
    'OWNER',
    'MEMBER'
);

ALTER TYPE "public"."TEAM_ROLE_ENUM" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_user_and_team"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  v_team_id UUID;
BEGIN
  -- Insert into public.teams and return the team_id
  INSERT INTO public.teams (
    name,
    is_personal
  )
  VALUES (
    NEW.raw_user_meta_data->>'full_name',
    TRUE
  )
  RETURNING id INTO v_team_id; -- Capture the team_id here

  -- Insert into public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    image_url,
    current_team_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    v_team_id -- Use the captured team_id here
  );

  -- Insert into public.users_on_teams using the captured team_id
  INSERT INTO public.users_on_teams (
    user_id,
    team_id,
    role
  )
  VALUES (
    NEW.id,
    v_team_id, -- Use the captured team_id here
    'OWNER'
  );

  -- Update the created user to have the created team_id as current_team_id
  -- UPDATE public.users
  -- SET current_team_id = v_team_id
  -- WHERE id = NEW.id;

  RETURN NEW;
END;$$;

ALTER FUNCTION "public"."create_user_and_team"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."integrations_slack" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone,
    "team_id" "uuid" NOT NULL,
    "slack_access_token" "text" NOT NULL,
    "slack_team_id" "text" NOT NULL,
    "slack_channel" "text" NOT NULL,
    "slack_channel_id" "text" NOT NULL,
    "slack_configuration_url" "text" NOT NULL,
    "slack_url" "text" NOT NULL,
    "slack_team_name" "text" NOT NULL,
    "slack_bot_user_id" "text" NOT NULL
);

ALTER TABLE "public"."integrations_slack" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone,
    "ticket_id" "uuid" NOT NULL,
    "body" "text" NOT NULL,
    "handler_id" "uuid",
    "email_id" "text",
    "sent_from_avatar_url" "text",
    "sent_from_email" "text",
    "sent_from_full_name" "text",
    "unable_to_parse_content" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."team_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "email" "text" NOT NULL,
    "team_id" "uuid" NOT NULL,
    "created_by_user_id" "uuid" NOT NULL,
    "code" "text" NOT NULL
);

ALTER TABLE "public"."team_invites" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "name" "text" NOT NULL,
    "image_url" "text",
    "is_personal" boolean DEFAULT false NOT NULL,
    "auth_token" "text"
);

ALTER TABLE "public"."teams" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ticket_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone,
    "name" "text" NOT NULL,
    "color" "text" NOT NULL,
    "team_id" "uuid" NOT NULL
);

ALTER TABLE "public"."ticket_tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ticket_tags_on_tickets" (
    "ticket_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone
);

ALTER TABLE "public"."ticket_tags_on_tickets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "subject" "text" NOT NULL,
    "meta" "jsonb",
    "updated_at" timestamp(6) with time zone,
    "short_id" "text" NOT NULL,
    "snoozed_until" timestamp(3) without time zone,
    "event_id" "text",
    "closed_at" timestamp(3) without time zone,
    "starred_at" timestamp(3) without time zone,
    "assigned_to_user_id" "uuid"
);

ALTER TABLE "public"."tickets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "email" character varying NOT NULL,
    "full_name" "text" NOT NULL,
    "image_url" "text",
    "current_team_id" "uuid" NOT NULL,
    "notification_email_new_ticket" boolean DEFAULT true NOT NULL,
    "notification_email_new_message" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_on_teams" (
    "user_id" "uuid" NOT NULL,
    "team_id" "uuid" NOT NULL,
    "role" "public"."TEAM_ROLE_ENUM" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone
);

ALTER TABLE "public"."users_on_teams" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."waitlist" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "email" "text" NOT NULL,
    "email_id" "text",
    "is_invited" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."waitlist" OWNER TO "postgres";

ALTER TABLE ONLY "public"."integrations_slack"
    ADD CONSTRAINT "integrations_slack_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team_invites"
    ADD CONSTRAINT "team_invites_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ticket_tags_on_tickets"
    ADD CONSTRAINT "ticket_tags_on_tickets_pkey" PRIMARY KEY ("ticket_id", "tag_id");

ALTER TABLE ONLY "public"."ticket_tags"
    ADD CONSTRAINT "ticket_tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users_on_teams"
    ADD CONSTRAINT "users_on_teams_pkey" PRIMARY KEY ("user_id", "team_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "integrations_slack_team_id_key" ON "public"."integrations_slack" USING "btree" ("team_id");

CREATE INDEX "messages_handler_id_ticket_id_idx" ON "public"."messages" USING "btree" ("handler_id", "ticket_id");

CREATE UNIQUE INDEX "team_invites_code_key" ON "public"."team_invites" USING "btree" ("code");

CREATE UNIQUE INDEX "team_invites_email_team_id_key" ON "public"."team_invites" USING "btree" ("email", "team_id");

CREATE INDEX "team_invites_team_id_created_by_user_id_idx" ON "public"."team_invites" USING "btree" ("team_id", "created_by_user_id");

CREATE UNIQUE INDEX "ticket_tags_name_team_id_key" ON "public"."ticket_tags" USING "btree" ("name", "team_id");

CREATE INDEX "ticket_tags_on_tickets_tag_id_ticket_id_idx" ON "public"."ticket_tags_on_tickets" USING "btree" ("tag_id", "ticket_id");

CREATE UNIQUE INDEX "ticket_tags_on_tickets_ticket_id_tag_id_key" ON "public"."ticket_tags_on_tickets" USING "btree" ("ticket_id", "tag_id");

CREATE INDEX "ticket_tags_team_id_idx" ON "public"."ticket_tags" USING "btree" ("team_id");

CREATE UNIQUE INDEX "tickets_short_id_key" ON "public"."tickets" USING "btree" ("short_id");

CREATE INDEX "tickets_team_id_assigned_to_user_id_idx" ON "public"."tickets" USING "btree" ("team_id", "assigned_to_user_id");

CREATE INDEX "users_current_team_id_idx" ON "public"."users" USING "btree" ("current_team_id");

CREATE INDEX "users_on_teams_team_id_user_id_idx" ON "public"."users_on_teams" USING "btree" ("team_id", "user_id");

CREATE UNIQUE INDEX "users_on_teams_user_id_team_id_key" ON "public"."users_on_teams" USING "btree" ("user_id", "team_id");

CREATE UNIQUE INDEX "waitlist_email_key" ON "public"."waitlist" USING "btree" ("email");

CREATE OR REPLACE TRIGGER "on-new-user" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://app.seventy-seven.dev/api/webhook/new-user', 'POST', '{"Content-type":"application/json","X-Api-Key":"XXX"}', '{}', '3000');

ALTER TABLE ONLY "public"."integrations_slack"
    ADD CONSTRAINT "integrations_slack_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_handler_id_fkey" FOREIGN KEY ("handler_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."team_invites"
    ADD CONSTRAINT "team_invites_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."team_invites"
    ADD CONSTRAINT "team_invites_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."ticket_tags_on_tickets"
    ADD CONSTRAINT "ticket_tags_on_tickets_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."ticket_tags"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."ticket_tags_on_tickets"
    ADD CONSTRAINT "ticket_tags_on_tickets_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."ticket_tags"
    ADD CONSTRAINT "ticket_tags_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_current_team_id_fkey" FOREIGN KEY ("current_team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."users_on_teams"
    ADD CONSTRAINT "users_on_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_on_teams"
    ADD CONSTRAINT "users_on_teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Only authenticated users can see their own data" ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Only authenticated users can see their own rows" ON "public"."users_on_teams" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Only authenticated users can see their own teams" ON "public"."teams" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users_on_teams"
  WHERE (("users_on_teams"."team_id" = "teams"."id") AND (( SELECT "auth"."uid"() AS "uid") = "users_on_teams"."user_id")))));

CREATE POLICY "Only authenticated users can see their team tickets" ON "public"."tickets" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users_on_teams"
  WHERE (("users_on_teams"."team_id" = "tickets"."team_id") AND (( SELECT "auth"."uid"() AS "uid") = "users_on_teams"."user_id")))));

CREATE POLICY "Only authenticated users can see ticket messages from their tea" ON "public"."messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."users_on_teams"
     JOIN "public"."tickets" ON (("tickets"."team_id" = "users_on_teams"."team_id")))
  WHERE (("users_on_teams"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("tickets"."id" = "messages"."ticket_id")))));

ALTER TABLE "public"."integrations_slack" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."team_invites" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ticket_tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ticket_tags_on_tickets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users_on_teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."waitlist" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_user_and_team"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_and_team"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_and_team"() TO "service_role";

GRANT ALL ON TABLE "public"."integrations_slack" TO "anon";
GRANT ALL ON TABLE "public"."integrations_slack" TO "authenticated";
GRANT ALL ON TABLE "public"."integrations_slack" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."team_invites" TO "anon";
GRANT ALL ON TABLE "public"."team_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."team_invites" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."ticket_tags" TO "anon";
GRANT ALL ON TABLE "public"."ticket_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."ticket_tags" TO "service_role";

GRANT ALL ON TABLE "public"."ticket_tags_on_tickets" TO "anon";
GRANT ALL ON TABLE "public"."ticket_tags_on_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."ticket_tags_on_tickets" TO "service_role";

GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON TABLE "public"."users_on_teams" TO "anon";
GRANT ALL ON TABLE "public"."users_on_teams" TO "authenticated";
GRANT ALL ON TABLE "public"."users_on_teams" TO "service_role";

GRANT ALL ON TABLE "public"."waitlist" TO "anon";
GRANT ALL ON TABLE "public"."waitlist" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
