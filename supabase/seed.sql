-- These mock users and projects are used for testing purposes only in apps/app/tests
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '2279f701-93af-4e38-9b7c-a347fe6986e7', 'authenticated', 'authenticated', 'seed_user1@seed.com', '$2a$10$.NjtOBG7biZcm2MBqTfcleGGkmxETMXUCylujf/Ry.sj1DvfwQosS', '2024-01-24 12:14:50.028056+00', NULL, '', '2024-01-24 12:14:35.664658+00', '', NULL, '', '', NULL, '2024-01-24 12:14:50.214691+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-24 12:14:35.657844+00', '2024-01-24 12:14:50.222683+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'c4ceb98f-346f-46a4-b529-0e495cef913d', 'authenticated', 'authenticated', 'seed_user2@seed.com', '$2a$10$Cx1EWRP6lQjncK978/vy5OT5SjNwiiYsMRBbIZXSRWOJZ6ymFPim2', '2024-01-24 12:17:00.771227+00', NULL, '', '2024-01-24 12:16:51.84195+00', '', NULL, '', '', NULL, '2024-01-24 12:17:00.906552+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-24 12:16:51.8382+00', '2024-01-24 12:17:00.909973+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL);

INSERT INTO auth.identities VALUES ('2279f701-93af-4e38-9b7c-a347fe6986e7', '2279f701-93af-4e38-9b7c-a347fe6986e7', '{"sub": "2279f701-93af-4e38-9b7c-a347fe6986e7", "email": "seed_user1@seed.com", "email_verified": false, "phone_verified": false}', 'email', '2024-01-24 12:14:35.662544+00', '2024-01-24 12:14:35.662582+00', '2024-01-24 12:14:35.662582+00', DEFAULT, 'd0d15da4-1085-4729-8855-6426aeea5e42');
INSERT INTO auth.identities VALUES ('c4ceb98f-346f-46a4-b529-0e495cef913d', 'c4ceb98f-346f-46a4-b529-0e495cef913d', '{"sub": "c4ceb98f-346f-46a4-b529-0e495cef913d", "email": "seed_user2@seed.com", "email_verified": false, "phone_verified": false}', 'email', '2024-01-24 12:16:51.840402+00', '2024-01-24 12:16:51.84043+00', '2024-01-24 12:16:51.84043+00', DEFAULT, 'a736605f-7d4f-4b49-ae08-6cae564dff28');

INSERT INTO public.organizations VALUES ('92f8cdd9-816e-486f-96ed-e2f997eb9224', 'seed_user1@seed.com''s organization', '2024-01-24 12:14:50.250927+00', NULL, NULL);
INSERT INTO public.organizations VALUES ('47e8e338-31a7-4233-9be1-9f1b3eb08b67', 'seed_user2@seed.com''s organization', '2024-01-24 12:17:00.923793+00', NULL, NULL);

INSERT INTO public.projects VALUES ('b631a52e-bf69-4c36-ab2b-4cc8a53220ec', 'Playground project', '{eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0X2lkIjoiYjYzMWE1MmUtYmY2OS00YzM2LWFiMmItNGNjOGE1MzIyMGVjIiwianRpIjoiNGJhOWY0NGItZjg0OS00ODBiLTljMjQtZmEwMmFhNWJmZTY1IiwiaWF0IjoxNzA2MDk4NDkwfQ.pW5mmBQDphTzQkqPP2ua9kDVeUWcog8AYl23Z7KqVvs}', '2024-01-24 12:14:50.263723+00', NULL, 'default', '92f8cdd9-816e-486f-96ed-e2f997eb9224');
INSERT INTO public.projects VALUES ('6b802cc2-bc95-4b80-a125-fbc5186c3804', 'Playground project', '{eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0X2lkIjoiNmI4MDJjYzItYmM5NS00YjgwLWExMjUtZmJjNTE4NmMzODA0IiwianRpIjoiYjVkMjgwZTMtOWM5ZS00MTNiLWI3MDEtYzgyMjIzZWY4ZTRiIiwiaWF0IjoxNzA2MDk4NjIwfQ.b3o3AwHMZKt7kbFQQrfE3jdk0OSlJexw3cj6Z8ysnxg}', '2024-01-24 12:17:00.938407+00', NULL, 'default', '47e8e338-31a7-4233-9be1-9f1b3eb08b67');

INSERT INTO public.organizations_users VALUES ('935fc542-7678-49d3-8e8d-66b84db53a7b', '2024-01-24 12:14:50.257914+00', '92f8cdd9-816e-486f-96ed-e2f997eb9224', '2279f701-93af-4e38-9b7c-a347fe6986e7');
INSERT INTO public.organizations_users VALUES ('7ab44275-74eb-410d-adc2-6594f18c8f6e', '2024-01-24 12:17:00.932747+00', '47e8e338-31a7-4233-9be1-9f1b3eb08b67', 'c4ceb98f-346f-46a4-b529-0e495cef913d');


-- Media (probably irrelevant already)
INSERT INTO storage.buckets(id, name, owner, public)
VALUES ('assets', 'assets', NULL, true);