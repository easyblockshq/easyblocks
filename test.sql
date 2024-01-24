--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-2.pgdg110+2)
-- Dumped by pg_dump version 16.1

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

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: postgres
--

INSERT INTO _realtime.tenants VALUES ('eab7b31d-a16b-414c-ab0a-b0559824a4ea', 'realtime-dev', 'realtime-dev', 'iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==', 200, '2024-01-24 12:26:34', '2024-01-24 12:26:34', 100, 'postgres_cdc_rls', 100000, 100, 100, false);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: postgres
--

INSERT INTO _realtime.extensions VALUES ('1ad68901-31c2-486d-9c1f-b110aa6fe81f', 'postgres_cdc_rls', '{"region": "us-east-1", "db_host": "+5JkR7EPoJsAtjz+cdk/ZGMDh4Ck8PWqtZx+VnDSocE=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "ip_version": 4, "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}', 'realtime-dev', '2024-01-24 12:26:34', '2024-01-24 12:26:34');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: postgres
--

INSERT INTO _realtime.schema_migrations VALUES (20210706140551, '2023-03-16 02:25:35');
INSERT INTO _realtime.schema_migrations VALUES (20220329161857, '2023-03-16 02:25:35');
INSERT INTO _realtime.schema_migrations VALUES (20220410212326, '2023-03-16 02:25:35');
INSERT INTO _realtime.schema_migrations VALUES (20220506102948, '2023-03-16 02:25:35');
INSERT INTO _realtime.schema_migrations VALUES (20220527210857, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20220815211129, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20220815215024, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20220818141501, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20221018173709, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20221102172703, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20221223010058, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20230110180046, '2023-03-16 02:25:36');
INSERT INTO _realtime.schema_migrations VALUES (20230810220907, '2023-11-20 21:54:23');
INSERT INTO _realtime.schema_migrations VALUES (20230810220924, '2023-11-20 21:54:23');
INSERT INTO _realtime.schema_migrations VALUES (20231024094642, '2023-11-20 21:54:23');


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'b7e38af0-86a0-44b3-b53f-139da3e55b2f', '{"action":"user_confirmation_requested","actor_id":"2279f701-93af-4e38-9b7c-a347fe6986e7","actor_username":"seed_user1@seed.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-01-24 12:14:35.663342+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'a4a8eea0-a46f-49dc-9f12-068a84154a61', '{"action":"user_signedup","actor_id":"2279f701-93af-4e38-9b7c-a347fe6986e7","actor_username":"seed_user1@seed.com","actor_via_sso":false,"log_type":"team"}', '2024-01-24 12:14:50.027031+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', 'a1a02da6-0799-49d2-9cf4-f30cc7246c2f', '{"action":"login","actor_id":"2279f701-93af-4e38-9b7c-a347fe6986e7","actor_username":"seed_user1@seed.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2024-01-24 12:14:50.213728+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '0050a872-64c7-4854-919b-ed19c45d3acc', '{"action":"logout","actor_id":"2279f701-93af-4e38-9b7c-a347fe6986e7","actor_username":"seed_user1@seed.com","actor_via_sso":false,"log_type":"account"}', '2024-01-24 12:16:43.749258+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '13a63e0a-987e-4fe1-827a-e17cc1fca290', '{"action":"user_confirmation_requested","actor_id":"c4ceb98f-346f-46a4-b529-0e495cef913d","actor_username":"seed_user2@seed.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-01-24 12:16:51.841096+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '7b9bd242-2cd1-478f-87dc-7734b187213d', '{"action":"user_signedup","actor_id":"c4ceb98f-346f-46a4-b529-0e495cef913d","actor_username":"seed_user2@seed.com","actor_via_sso":false,"log_type":"team"}', '2024-01-24 12:17:00.770088+00', '');
INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '128417ae-7ad1-4fd4-baf2-3ad7d86cac8a', '{"action":"login","actor_id":"c4ceb98f-346f-46a4-b529-0e495cef913d","actor_username":"seed_user2@seed.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2024-01-24 12:17:00.904769+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '2279f701-93af-4e38-9b7c-a347fe6986e7', 'authenticated', 'authenticated', 'seed_user1@seed.com', '$2a$10$.NjtOBG7biZcm2MBqTfcleGGkmxETMXUCylujf/Ry.sj1DvfwQosS', '2024-01-24 12:14:50.028056+00', NULL, '', '2024-01-24 12:14:35.664658+00', '', NULL, '', '', NULL, '2024-01-24 12:14:50.214691+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-24 12:14:35.657844+00', '2024-01-24 12:14:50.222683+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'c4ceb98f-346f-46a4-b529-0e495cef913d', 'authenticated', 'authenticated', 'seed_user2@seed.com', '$2a$10$Cx1EWRP6lQjncK978/vy5OT5SjNwiiYsMRBbIZXSRWOJZ6ymFPim2', '2024-01-24 12:17:00.771227+00', NULL, '', '2024-01-24 12:16:51.84195+00', '', NULL, '', '', NULL, '2024-01-24 12:17:00.906552+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-24 12:16:51.8382+00', '2024-01-24 12:17:00.909973+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities VALUES ('2279f701-93af-4e38-9b7c-a347fe6986e7', '2279f701-93af-4e38-9b7c-a347fe6986e7', '{"sub": "2279f701-93af-4e38-9b7c-a347fe6986e7", "email": "seed_user1@seed.com", "email_verified": false, "phone_verified": false}', 'email', '2024-01-24 12:14:35.662544+00', '2024-01-24 12:14:35.662582+00', '2024-01-24 12:14:35.662582+00', DEFAULT, 'd0d15da4-1085-4729-8855-6426aeea5e42');
INSERT INTO auth.identities VALUES ('c4ceb98f-346f-46a4-b529-0e495cef913d', 'c4ceb98f-346f-46a4-b529-0e495cef913d', '{"sub": "c4ceb98f-346f-46a4-b529-0e495cef913d", "email": "seed_user2@seed.com", "email_verified": false, "phone_verified": false}', 'email', '2024-01-24 12:16:51.840402+00', '2024-01-24 12:16:51.84043+00', '2024-01-24 12:16:51.84043+00', DEFAULT, 'a736605f-7d4f-4b49-ae08-6cae564dff28');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions VALUES ('3a6d7c34-dac6-4bb2-b502-26cfcd4a73c6', 'c4ceb98f-346f-46a4-b529-0e495cef913d', '2024-01-24 12:17:00.906679+00', '2024-01-24 12:17:00.906679+00', NULL, 'aal1', NULL, NULL, 'undici', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.mfa_amr_claims VALUES ('3a6d7c34-dac6-4bb2-b502-26cfcd4a73c6', '2024-01-24 12:17:00.910425+00', '2024-01-24 12:17:00.910425+00', 'email/signup', 'cefc897c-a10f-4a75-9814-b98505956efa');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 2, 'AlUzGhQeKgdvwmu8MZqZPA', 'c4ceb98f-346f-46a4-b529-0e495cef913d', false, '2024-01-24 12:17:00.908223+00', '2024-01-24 12:17:00.908223+00', NULL, '3a6d7c34-dac6-4bb2-b502-26cfcd4a73c6');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.schema_migrations VALUES ('20171026211738');
INSERT INTO auth.schema_migrations VALUES ('20171026211808');
INSERT INTO auth.schema_migrations VALUES ('20171026211834');
INSERT INTO auth.schema_migrations VALUES ('20180103212743');
INSERT INTO auth.schema_migrations VALUES ('20180108183307');
INSERT INTO auth.schema_migrations VALUES ('20180119214651');
INSERT INTO auth.schema_migrations VALUES ('20180125194653');
INSERT INTO auth.schema_migrations VALUES ('00');
INSERT INTO auth.schema_migrations VALUES ('20210710035447');
INSERT INTO auth.schema_migrations VALUES ('20210722035447');
INSERT INTO auth.schema_migrations VALUES ('20210730183235');
INSERT INTO auth.schema_migrations VALUES ('20210909172000');
INSERT INTO auth.schema_migrations VALUES ('20210927181326');
INSERT INTO auth.schema_migrations VALUES ('20211122151130');
INSERT INTO auth.schema_migrations VALUES ('20211124214934');
INSERT INTO auth.schema_migrations VALUES ('20211202183645');
INSERT INTO auth.schema_migrations VALUES ('20220114185221');
INSERT INTO auth.schema_migrations VALUES ('20220114185340');
INSERT INTO auth.schema_migrations VALUES ('20220224000811');
INSERT INTO auth.schema_migrations VALUES ('20220323170000');
INSERT INTO auth.schema_migrations VALUES ('20220429102000');
INSERT INTO auth.schema_migrations VALUES ('20220531120530');
INSERT INTO auth.schema_migrations VALUES ('20220614074223');
INSERT INTO auth.schema_migrations VALUES ('20220811173540');
INSERT INTO auth.schema_migrations VALUES ('20221003041349');
INSERT INTO auth.schema_migrations VALUES ('20221003041400');
INSERT INTO auth.schema_migrations VALUES ('20221011041400');
INSERT INTO auth.schema_migrations VALUES ('20221020193600');
INSERT INTO auth.schema_migrations VALUES ('20221021073300');
INSERT INTO auth.schema_migrations VALUES ('20221021082433');
INSERT INTO auth.schema_migrations VALUES ('20221027105023');
INSERT INTO auth.schema_migrations VALUES ('20221114143122');
INSERT INTO auth.schema_migrations VALUES ('20221114143410');
INSERT INTO auth.schema_migrations VALUES ('20221125140132');
INSERT INTO auth.schema_migrations VALUES ('20221208132122');
INSERT INTO auth.schema_migrations VALUES ('20221215195500');
INSERT INTO auth.schema_migrations VALUES ('20221215195800');
INSERT INTO auth.schema_migrations VALUES ('20221215195900');
INSERT INTO auth.schema_migrations VALUES ('20230116124310');
INSERT INTO auth.schema_migrations VALUES ('20230116124412');
INSERT INTO auth.schema_migrations VALUES ('20230131181311');
INSERT INTO auth.schema_migrations VALUES ('20230322519590');
INSERT INTO auth.schema_migrations VALUES ('20230402418590');
INSERT INTO auth.schema_migrations VALUES ('20230411005111');
INSERT INTO auth.schema_migrations VALUES ('20230508135423');
INSERT INTO auth.schema_migrations VALUES ('20230523124323');
INSERT INTO auth.schema_migrations VALUES ('20230818113222');
INSERT INTO auth.schema_migrations VALUES ('20230914180801');
INSERT INTO auth.schema_migrations VALUES ('20231027141322');
INSERT INTO auth.schema_migrations VALUES ('20231114161723');
INSERT INTO auth.schema_migrations VALUES ('20231117164230');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

INSERT INTO pgsodium.key VALUES ('3dea6a51-34ca-4fc7-8587-c28e5554a61d', 'default', '2024-01-24 12:14:07.339052', NULL, NULL, 1, '\x7067736f6469756d', 'This is the default key used for vault.secrets', NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.buckets VALUES ('assets', 'assets', NULL, '2024-01-24 12:14:19.560395+00', '2024-01-24 12:14:19.560395+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.organizations VALUES ('92f8cdd9-816e-486f-96ed-e2f997eb9224', 'seed_user1@seed.com''s organization', '2024-01-24 12:14:50.250927+00', NULL, NULL);
INSERT INTO public.organizations VALUES ('47e8e338-31a7-4233-9be1-9f1b3eb08b67', 'seed_user2@seed.com''s organization', '2024-01-24 12:17:00.923793+00', NULL, NULL);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.projects VALUES ('b631a52e-bf69-4c36-ab2b-4cc8a53220ec', 'Playground project', '{eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0X2lkIjoiYjYzMWE1MmUtYmY2OS00YzM2LWFiMmItNGNjOGE1MzIyMGVjIiwianRpIjoiNGJhOWY0NGItZjg0OS00ODBiLTljMjQtZmEwMmFhNWJmZTY1IiwiaWF0IjoxNzA2MDk4NDkwfQ.pW5mmBQDphTzQkqPP2ua9kDVeUWcog8AYl23Z7KqVvs}', '2024-01-24 12:14:50.263723+00', NULL, 'default', '92f8cdd9-816e-486f-96ed-e2f997eb9224');
INSERT INTO public.projects VALUES ('6b802cc2-bc95-4b80-a125-fbc5186c3804', 'Playground project', '{eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0X2lkIjoiNmI4MDJjYzItYmM5NS00YjgwLWExMjUtZmJjNTE4NmMzODA0IiwianRpIjoiYjVkMjgwZTMtOWM5ZS00MTNiLWI3MDEtYzgyMjIzZWY4ZTRiIiwiaWF0IjoxNzA2MDk4NjIwfQ.b3o3AwHMZKt7kbFQQrfE3jdk0OSlJexw3cj6Z8ysnxg}', '2024-01-24 12:17:00.938407+00', NULL, 'default', '47e8e338-31a7-4233-9be1-9f1b3eb08b67');


--
-- Data for Name: configs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: organizations_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.organizations_users VALUES ('935fc542-7678-49d3-8e8d-66b84db53a7b', '2024-01-24 12:14:50.257914+00', '92f8cdd9-816e-486f-96ed-e2f997eb9224', '2279f701-93af-4e38-9b7c-a347fe6986e7');
INSERT INTO public.organizations_users VALUES ('7ab44275-74eb-410d-adc2-6594f18c8f6e', '2024-01-24 12:17:00.932747+00', '47e8e338-31a7-4233-9be1-9f1b3eb08b67', 'c4ceb98f-346f-46a4-b529-0e495cef913d');


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: template_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2023-03-16 02:25:37.548482');
INSERT INTO storage.migrations VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2023-03-16 02:25:37.55595');
INSERT INTO storage.migrations VALUES (2, 'pathtoken-column', '49756be03be4c17bb85fe70d4a861f27de7e49ad', '2023-03-16 02:25:37.560258');
INSERT INTO storage.migrations VALUES (3, 'add-migrations-rls', 'bb5d124c53d68635a883e399426c6a5a25fc893d', '2023-03-16 02:25:37.594153');
INSERT INTO storage.migrations VALUES (4, 'add-size-functions', '6d79007d04f5acd288c9c250c42d2d5fd286c54d', '2023-03-16 02:25:37.599194');
INSERT INTO storage.migrations VALUES (5, 'change-column-name-in-get-size', 'fd65688505d2ffa9fbdc58a944348dd8604d688c', '2023-03-16 02:25:37.604658');
INSERT INTO storage.migrations VALUES (6, 'add-rls-to-buckets', '63e2bab75a2040fee8e3fb3f15a0d26f3380e9b6', '2023-03-16 02:25:37.609563');
INSERT INTO storage.migrations VALUES (7, 'add-public-to-buckets', '82568934f8a4d9e0a85f126f6fb483ad8214c418', '2023-03-16 02:25:37.615929');
INSERT INTO storage.migrations VALUES (8, 'fix-search-function', '1a43a40eddb525f2e2f26efd709e6c06e58e059c', '2023-03-16 02:25:37.620171');
INSERT INTO storage.migrations VALUES (9, 'search-files-search-function', '34c096597eb8b9d077fdfdde9878c88501b2fafc', '2023-03-16 02:25:37.624484');
INSERT INTO storage.migrations VALUES (10, 'add-trigger-to-auto-update-updated_at-column', '37d6bb964a70a822e6d37f22f457b9bca7885928', '2023-03-16 02:25:37.629534');
INSERT INTO storage.migrations VALUES (11, 'add-automatic-avif-detection-flag', 'bd76c53a9c564c80d98d119c1b3a28e16c8152db', '2023-03-16 02:25:37.634022');
INSERT INTO storage.migrations VALUES (12, 'add-bucket-custom-limits', 'cbe0a4c32a0e891554a21020433b7a4423c07ee7', '2023-03-16 02:25:37.639132');
INSERT INTO storage.migrations VALUES (13, 'use-bytes-for-max-size', '7a158ebce8a0c2801c9c65b7e9b2f98f68b3874e', '2023-03-16 02:25:37.643598');
INSERT INTO storage.migrations VALUES (14, 'add-can-insert-object-function', '273193826bca7e0990b458d1ba72f8aa27c0d825', '2023-04-06 09:18:55.232202');
INSERT INTO storage.migrations VALUES (15, 'add-version', 'e821a779d26612899b8c2dfe20245f904a327c4f', '2023-04-06 09:18:55.239444');
INSERT INTO storage.migrations VALUES (16, 'drop-owner-foreign-key', '536b33f8878eed09d0144219777dcac96bdb25da', '2023-11-20 21:54:33.540386');
INSERT INTO storage.migrations VALUES (17, 'add_owner_id_column_deprecate_owner', '7545f216a39358b5487df75d941d05dbcd75eb46', '2023-11-20 22:04:38.959686');


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

INSERT INTO supabase_functions.migrations VALUES ('initial', '2023-03-16 02:25:30.966697+00');
INSERT INTO supabase_functions.migrations VALUES ('20210809183423_update_grants', '2023-03-16 02:25:30.966697+00');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

INSERT INTO supabase_migrations.schema_migrations VALUES ('20230811073505', '{"set check_function_bodies = off","CREATE OR REPLACE FUNCTION public.project_id_from_access_token()
 RETURNS uuid
 LANGUAGE sql
AS $function$
  select nullif(current_setting(''request.jwt.claims'', true)::json->>''project_id'', '''')::uuid;
$function$","create table \"public\".\"assets\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"asset_id\" uuid not null,
    \"metadata\" jsonb,
    \"created_at\" timestamp with time zone default now(),
    \"updated_at\" timestamp with time zone
)","alter table \"public\".\"assets\" enable row level security","create table \"public\".\"configs\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"config\" json not null,
    \"parent_id\" uuid,
    \"project_id\" uuid not null default project_id_from_access_token(),
    \"created_at\" timestamp with time zone not null default timezone(''utc''::text, now()),
    \"metadata\" json,
    \"updated_at\" timestamp with time zone default (now() AT TIME ZONE ''utc''::text)
)","alter table \"public\".\"configs\" enable row level security","create table \"public\".\"documents\" (
    \"created_at\" timestamp with time zone default now(),
    \"title\" text not null,
    \"config_id\" uuid not null,
    \"project_id\" uuid not null default project_id_from_access_token(),
    \"archived\" boolean not null default false,
    \"id\" uuid not null default uuid_generate_v4(),
    \"unique_source_identifier\" text,
    \"source\" text,
    \"version\" bigint not null default ''0''::bigint,
    \"root_container\" text default ''NULL''::text
)","alter table \"public\".\"documents\" enable row level security","create table \"public\".\"organizations\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"name\" text not null,
    \"created_at\" timestamp with time zone default now(),
    \"updated_at\" timestamp with time zone,
    \"tokens\" text[]
)","alter table \"public\".\"organizations\" enable row level security","create table \"public\".\"organizations_users\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"created_at\" timestamp with time zone default now(),
    \"organization_id\" uuid not null,
    \"user_id\" uuid not null
)","alter table \"public\".\"organizations_users\" enable row level security","create table \"public\".\"projects\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"name\" text not null,
    \"tokens\" text[] not null default ''{}''::text[],
    \"created_at\" timestamp with time zone not null default timezone(''utc''::text, now()),
    \"updated_at\" timestamp with time zone,
    \"type\" text not null default ''default''::text,
    \"organization_id\" uuid not null
)","alter table \"public\".\"projects\" enable row level security","create table \"public\".\"template_mappings\" (
    \"id\" uuid not null default uuid_generate_v4(),
    \"created_at\" timestamp with time zone not null default now(),
    \"master_id\" text not null,
    \"project_id\" uuid not null default project_id_from_access_token(),
    \"template_id\" uuid
)","alter table \"public\".\"template_mappings\" enable row level security","create table \"public\".\"templates\" (
    \"created_at\" timestamp with time zone default now(),
    \"label\" text not null,
    \"config_id\" uuid not null,
    \"project_id\" uuid not null default project_id_from_access_token(),
    \"archived\" boolean not null default false,
    \"id\" uuid not null default uuid_generate_v4(),
    \"width\" integer,
    \"widthAuto\" boolean
)","alter table \"public\".\"templates\" enable row level security","CREATE UNIQUE INDEX assets_metadata_pkey ON public.assets USING btree (id)","CREATE UNIQUE INDEX configs_pkey ON public.configs USING btree (id)","CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id)","CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id)","CREATE UNIQUE INDEX organizations_users_pkey ON public.organizations_users USING btree (id)","CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id)","CREATE UNIQUE INDEX template_mappings_pkey ON public.template_mappings USING btree (id)","CREATE UNIQUE INDEX templates_pkey ON public.templates USING btree (id)","alter table \"public\".\"assets\" add constraint \"assets_metadata_pkey\" PRIMARY KEY using index \"assets_metadata_pkey\"","alter table \"public\".\"configs\" add constraint \"configs_pkey\" PRIMARY KEY using index \"configs_pkey\"","alter table \"public\".\"documents\" add constraint \"documents_pkey\" PRIMARY KEY using index \"documents_pkey\"","alter table \"public\".\"organizations\" add constraint \"organizations_pkey\" PRIMARY KEY using index \"organizations_pkey\"","alter table \"public\".\"organizations_users\" add constraint \"organizations_users_pkey\" PRIMARY KEY using index \"organizations_users_pkey\"","alter table \"public\".\"projects\" add constraint \"projects_pkey\" PRIMARY KEY using index \"projects_pkey\"","alter table \"public\".\"template_mappings\" add constraint \"template_mappings_pkey\" PRIMARY KEY using index \"template_mappings_pkey\"","alter table \"public\".\"templates\" add constraint \"templates_pkey\" PRIMARY KEY using index \"templates_pkey\"","alter table \"public\".\"assets\" add constraint \"assets_asset_id_fkey\" FOREIGN KEY (asset_id) REFERENCES storage.objects(id) not valid","alter table \"public\".\"assets\" validate constraint \"assets_asset_id_fkey\"","alter table \"public\".\"configs\" add constraint \"configs_parent_id_fkey\" FOREIGN KEY (parent_id) REFERENCES configs(id) ON DELETE SET NULL not valid","alter table \"public\".\"configs\" validate constraint \"configs_parent_id_fkey\"","alter table \"public\".\"configs\" add constraint \"configs_project_id_fkey\" FOREIGN KEY (project_id) REFERENCES projects(id) not valid","alter table \"public\".\"configs\" validate constraint \"configs_project_id_fkey\"","alter table \"public\".\"documents\" add constraint \"documents_config_id_fkey\" FOREIGN KEY (config_id) REFERENCES configs(id) not valid","alter table \"public\".\"documents\" validate constraint \"documents_config_id_fkey\"","alter table \"public\".\"documents\" add constraint \"documents_project_id_fkey\" FOREIGN KEY (project_id) REFERENCES projects(id) not valid","alter table \"public\".\"documents\" validate constraint \"documents_project_id_fkey\"","alter table \"public\".\"organizations_users\" add constraint \"organizations_users_organization_id_fkey\" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid","alter table \"public\".\"organizations_users\" validate constraint \"organizations_users_organization_id_fkey\"","alter table \"public\".\"organizations_users\" add constraint \"organizations_users_user_id_fkey\" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid","alter table \"public\".\"organizations_users\" validate constraint \"organizations_users_user_id_fkey\"","alter table \"public\".\"projects\" add constraint \"projects_organization_id_fkey\" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid","alter table \"public\".\"projects\" validate constraint \"projects_organization_id_fkey\"","alter table \"public\".\"template_mappings\" add constraint \"template_mappings_project_id_fkey\" FOREIGN KEY (project_id) REFERENCES projects(id) not valid","alter table \"public\".\"template_mappings\" validate constraint \"template_mappings_project_id_fkey\"","alter table \"public\".\"template_mappings\" add constraint \"template_mappings_template_id_fkey\" FOREIGN KEY (template_id) REFERENCES templates(id) not valid","alter table \"public\".\"template_mappings\" validate constraint \"template_mappings_template_id_fkey\"","alter table \"public\".\"templates\" add constraint \"templates_config_id_fkey\" FOREIGN KEY (config_id) REFERENCES configs(id) not valid","alter table \"public\".\"templates\" validate constraint \"templates_config_id_fkey\"","alter table \"public\".\"templates\" add constraint \"templates_project_id_fkey\" FOREIGN KEY (project_id) REFERENCES projects(id) not valid","alter table \"public\".\"templates\" validate constraint \"templates_project_id_fkey\"","CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$function$","create policy \"Access\"
on \"public\".\"assets\"
as permissive
for all
to public
using (true)
with check (true)","create policy \"Active project\"
on \"public\".\"configs\"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))","create policy \"Active project\"
on \"public\".\"documents\"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))","create policy \"Enable access to user''s organizations\"
on \"public\".\"organizations\"
as permissive
for select
to authenticated
using ((id IN ( SELECT organizations_users.organization_id
   FROM organizations_users
  WHERE ((organizations_users.organization_id = organizations.id) AND (organizations_users.user_id = auth.uid())))))","create policy \"Enable access to user''s organizations\"
on \"public\".\"organizations_users\"
as permissive
for select
to authenticated
using ((user_id = auth.uid()))","create policy \"Enable access to authenticated users\"
on \"public\".\"projects\"
as permissive
for insert
to authenticated
with check (true)","create policy \"Enable access to user''s projects\"
on \"public\".\"projects\"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT organizations_users.user_id
   FROM organizations_users
  WHERE (organizations_users.organization_id = projects.organization_id))))","create policy \"Enable select for project claimed in JWT token\"
on \"public\".\"projects\"
as permissive
for select
to anon
using ((project_id_from_access_token() = id))","create policy \"Enable update to user''s projects\"
on \"public\".\"projects\"
as permissive
for update
to authenticated
using (true)
with check (true)","create policy \"Active project\"
on \"public\".\"template_mappings\"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))","create policy \"Active project.\"
on \"public\".\"templates\"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))","CREATE TRIGGER update_updated_at_column BEFORE UPDATE ON public.configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","set check_function_bodies = off","CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, ''/'') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, ''.'', 2);
END
$function$","CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, ''/'') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$","CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, ''/'') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$","create policy \"Give users access to assets 1bqp9qb_0\"
on \"storage\".\"objects\"
as permissive
for select
to anon, authenticated
using (true)","create policy \"Give users access to assets 1bqp9qb_1\"
on \"storage\".\"objects\"
as permissive
for insert
to anon, authenticated
with check (true)","create policy \"Give users access to assets 1bqp9qb_2\"
on \"storage\".\"objects\"
as permissive
for update
to anon, authenticated
using (true)","create policy \"Give users access to assets 1bqp9qb_3\"
on \"storage\".\"objects\"
as permissive
for delete
to anon, authenticated
using (true)"}', 'init');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20231220111946', '{"drop policy \"Active project\" on \"public\".\"configs\"","drop policy \"Active project\" on \"public\".\"documents\"","set check_function_bodies = off","CREATE OR REPLACE FUNCTION public.organizations_id_of_user()
 RETURNS SETOF uuid
 LANGUAGE sql
AS $function$
  select organization_id
  from organizations_users
  where user_id = auth.uid()
$function$","create policy \"Only configs for documents owned by user''s organization\"
on \"public\".\"configs\"
as permissive
for select
to authenticated
using ((id IN ( SELECT documents.config_id
   FROM documents
  WHERE (documents.project_id IN ( SELECT projects.id
           FROM projects
          WHERE (projects.organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))))))","create policy \"Enable access to documents owned by user''s organizations\"
on \"public\".\"documents\"
as permissive
for select
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))))","create policy \"Active project\"
on \"public\".\"configs\"
as permissive
for all
to anon
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))","create policy \"Active project\"
on \"public\".\"documents\"
as permissive
for all
to anon
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id))"}', 'rls_for_documents_and_configs');
INSERT INTO supabase_migrations.schema_migrations VALUES ('20231220113551', '{"drop policy \"Enable update to user''s projects\" on \"public\".\"projects\"","create policy \"Enable update to user''s projects\"
on \"public\".\"projects\"
as permissive
for update
to authenticated
using ((organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))
with check ((organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))"}', 'rls_for_projects_update');


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 2, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

