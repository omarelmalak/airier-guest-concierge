--
-- PostgreSQL database dump
--

\restrict CHrTCpHNhNugqovYh8h8MudIISfxlYoH2MYDXgRVolWZpcBOCmckJrLilbuMqUW

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: check_max_active_guests_per_property(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_max_active_guests_per_property() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.is_active = true THEN
    IF (
      SELECT COUNT(*) FROM reservations
      WHERE property_id = NEW.property_id
        AND is_active = true
        AND id IS DISTINCT FROM NEW.id
    ) >= 3 THEN
      RAISE EXCEPTION 'No more than 3 guests can be active per property';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.hosts (
    auth_user_id,
    email,
    phone,
    first_name,
    last_name
  )
  values (
    new.id,
    new.email,
    null,
    null,
    null
  );

  return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: auto_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auto_messages (
    text_id uuid,
    kind text NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    send_at timestamp with time zone NOT NULL,
    locked_by text,
    locked_at timestamp with time zone,
    reservation_id uuid NOT NULL,
    CONSTRAINT auto_messages_type_check CHECK ((kind = ANY (ARRAY['response'::text, 'checkin'::text, 'checkout'::text])))
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reservation_id uuid
);


--
-- Name: escalations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.escalations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    summary text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: exact_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exact_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: guests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text,
    phone text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hosts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hosts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    auth_user_id uuid NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    phone text
);


--
-- Name: knowledge_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: knowledge_category_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_category_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    knowledge_category_id uuid NOT NULL,
    feature_id uuid NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    property_id uuid NOT NULL
);


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    host_id uuid NOT NULL,
    name text NOT NULL,
    property_type text,
    bedrooms integer,
    bathrooms integer,
    address text,
    checkin_msg text,
    checkout_msg text,
    photo text,
    created_at timestamp with time zone DEFAULT now(),
    ownership_level text,
    checkin_time time without time zone,
    checkout_time time without time zone,
    checkin_reminder_hours real,
    checkout_reminder_hours real,
    timezone text
);


--
-- Name: property_knowledge_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_knowledge_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    knowledge_category_id uuid NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    guest_id uuid NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    is_active boolean NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    stripe_customer_id text NOT NULL,
    stripe_subscription_id text NOT NULL,
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.texts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    content text NOT NULL,
    role text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sent_at timestamp with time zone,
    provider_sid text,
    CONSTRAINT texts_role_check CHECK ((role = ANY (ARRAY['guest'::text, 'airier'::text])))
);


--
-- Name: waitlisted_hosts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlisted_hosts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE waitlisted_hosts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.waitlisted_hosts IS 'Emails of hosts waitlisted for airier';


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: auto_messages auto_messages_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auto_messages
    ADD CONSTRAINT auto_messages_id_key UNIQUE (id);


--
-- Name: auto_messages auto_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auto_messages
    ADD CONSTRAINT auto_messages_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_reservation_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_reservation_id_key UNIQUE (reservation_id);


--
-- Name: escalations escalations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.escalations
    ADD CONSTRAINT escalations_pkey PRIMARY KEY (id);


--
-- Name: exact_answers exact_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exact_answers
    ADD CONSTRAINT exact_answers_pkey PRIMARY KEY (id);


--
-- Name: exact_answers exact_answers_property_question_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exact_answers
    ADD CONSTRAINT exact_answers_property_question_unique UNIQUE (property_id, question);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- Name: hosts hosts_auth_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_auth_user_id_key UNIQUE (auth_user_id);


--
-- Name: hosts hosts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_pkey PRIMARY KEY (id);


--
-- Name: knowledge_categories knowledge_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_categories
    ADD CONSTRAINT knowledge_categories_name_key UNIQUE (name);


--
-- Name: knowledge_categories knowledge_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_categories
    ADD CONSTRAINT knowledge_categories_pkey PRIMARY KEY (id);


--
-- Name: knowledge_category_features knowledge_category_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_category_features
    ADD CONSTRAINT knowledge_category_features_pkey PRIMARY KEY (id);


--
-- Name: property_knowledge_categories pkc_property_category_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_knowledge_categories
    ADD CONSTRAINT pkc_property_category_unique UNIQUE (property_id, knowledge_category_id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_knowledge_categories property_knowledge_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_knowledge_categories
    ADD CONSTRAINT property_knowledge_categories_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_stripe_subscription_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_stripe_subscription_id_key UNIQUE (stripe_subscription_id);


--
-- Name: texts texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);


--
-- Name: waitlisted_hosts waitlisted_hosts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlisted_hosts
    ADD CONSTRAINT waitlisted_hosts_pkey PRIMARY KEY (id);


--
-- Name: one_active_subscription_per_property; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX one_active_subscription_per_property ON public.subscriptions USING btree (property_id) WHERE (cancelled_at IS NULL);


--
-- Name: reservations enforce_max_active_guests_per_property; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_max_active_guests_per_property BEFORE INSERT OR UPDATE OF is_active ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.check_max_active_guests_per_property();


--
-- Name: auto_messages auto_messages_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auto_messages
    ADD CONSTRAINT auto_messages_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE CASCADE;


--
-- Name: auto_messages auto_messages_text_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auto_messages
    ADD CONSTRAINT auto_messages_text_id_fkey FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE SET NULL;


--
-- Name: escalations escalations_conversation_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.escalations
    ADD CONSTRAINT escalations_conversation_fk FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: exact_answers exactanswers_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exact_answers
    ADD CONSTRAINT exactanswers_properties_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: hosts hosts_auth_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_auth_user_fk FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: knowledge_category_features kcf_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_category_features
    ADD CONSTRAINT kcf_category_fk FOREIGN KEY (knowledge_category_id) REFERENCES public.knowledge_categories(id) ON DELETE CASCADE;


--
-- Name: knowledge_category_features kcf_feature_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_category_features
    ADD CONSTRAINT kcf_feature_fk FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: knowledge_category_features knowledge_category_features_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_category_features
    ADD CONSTRAINT knowledge_category_features_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_knowledge_categories pkc_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_knowledge_categories
    ADD CONSTRAINT pkc_category_fk FOREIGN KEY (knowledge_category_id) REFERENCES public.knowledge_categories(id) ON DELETE CASCADE;


--
-- Name: property_knowledge_categories pkc_property_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_knowledge_categories
    ADD CONSTRAINT pkc_property_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: properties properties_host_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_host_fk FOREIGN KEY (host_id) REFERENCES public.hosts(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_guest_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_guest_fk FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_property_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_property_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_property_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_property_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: texts texts_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: hosts Users can delete their own host record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own host record" ON public.hosts FOR DELETE USING ((auth_user_id = auth.uid()));


--
-- Name: hosts Users can insert their own host record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own host record" ON public.hosts FOR INSERT WITH CHECK ((auth_user_id = auth.uid()));


--
-- Name: hosts Users can select their own host record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can select their own host record" ON public.hosts FOR SELECT USING ((auth_user_id = auth.uid()));


--
-- Name: hosts Users can update their own host record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own host record" ON public.hosts FOR UPDATE USING ((auth_user_id = auth.uid())) WITH CHECK ((auth_user_id = auth.uid()));


--
-- Name: guests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

--
-- Name: hosts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;

--
-- Name: waitlisted_hosts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.waitlisted_hosts ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict CHrTCpHNhNugqovYh8h8MudIISfxlYoH2MYDXgRVolWZpcBOCmckJrLilbuMqUW

