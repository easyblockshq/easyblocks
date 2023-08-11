set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.project_id_from_access_token()
 RETURNS uuid
 LANGUAGE sql
AS $function$
  select nullif(current_setting('request.jwt.claims', true)::json->>'project_id', '')::uuid;
$function$
;

create table "public"."assets" (
    "id" uuid not null default uuid_generate_v4(),
    "asset_id" uuid not null,
    "metadata" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone
);


alter table "public"."assets" enable row level security;

create table "public"."configs" (
    "id" uuid not null default uuid_generate_v4(),
    "config" json not null,
    "parent_id" uuid,
    "project_id" uuid not null default project_id_from_access_token(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "metadata" json,
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."configs" enable row level security;

create table "public"."documents" (
    "created_at" timestamp with time zone default now(),
    "title" text not null,
    "config_id" uuid not null,
    "project_id" uuid not null default project_id_from_access_token(),
    "archived" boolean not null default false,
    "id" uuid not null default uuid_generate_v4(),
    "unique_source_identifier" text,
    "source" text,
    "version" bigint not null default '0'::bigint,
    "root_container" text default 'NULL'::text
);


alter table "public"."documents" enable row level security;

create table "public"."organizations" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone,
    "tokens" text[]
);


alter table "public"."organizations" enable row level security;

create table "public"."organizations_users" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "organization_id" uuid not null,
    "user_id" uuid not null
);


alter table "public"."organizations_users" enable row level security;

create table "public"."projects" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "tokens" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone,
    "type" text not null default 'default'::text,
    "organization_id" uuid not null
);


alter table "public"."projects" enable row level security;

create table "public"."template_mappings" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "master_id" text not null,
    "project_id" uuid not null default project_id_from_access_token(),
    "template_id" uuid
);


alter table "public"."template_mappings" enable row level security;

create table "public"."templates" (
    "created_at" timestamp with time zone default now(),
    "label" text not null,
    "config_id" uuid not null,
    "project_id" uuid not null default project_id_from_access_token(),
    "archived" boolean not null default false,
    "id" uuid not null default uuid_generate_v4(),
    "width" integer,
    "widthAuto" boolean
);


alter table "public"."templates" enable row level security;

CREATE UNIQUE INDEX assets_metadata_pkey ON public.assets USING btree (id);

CREATE UNIQUE INDEX configs_pkey ON public.configs USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX organizations_users_pkey ON public.organizations_users USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX template_mappings_pkey ON public.template_mappings USING btree (id);

CREATE UNIQUE INDEX templates_pkey ON public.templates USING btree (id);

alter table "public"."assets" add constraint "assets_metadata_pkey" PRIMARY KEY using index "assets_metadata_pkey";

alter table "public"."configs" add constraint "configs_pkey" PRIMARY KEY using index "configs_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."organizations_users" add constraint "organizations_users_pkey" PRIMARY KEY using index "organizations_users_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."template_mappings" add constraint "template_mappings_pkey" PRIMARY KEY using index "template_mappings_pkey";

alter table "public"."templates" add constraint "templates_pkey" PRIMARY KEY using index "templates_pkey";

alter table "public"."assets" add constraint "assets_asset_id_fkey" FOREIGN KEY (asset_id) REFERENCES storage.objects(id) not valid;

alter table "public"."assets" validate constraint "assets_asset_id_fkey";

alter table "public"."configs" add constraint "configs_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES configs(id) ON DELETE SET NULL not valid;

alter table "public"."configs" validate constraint "configs_parent_id_fkey";

alter table "public"."configs" add constraint "configs_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."configs" validate constraint "configs_project_id_fkey";

alter table "public"."documents" add constraint "documents_config_id_fkey" FOREIGN KEY (config_id) REFERENCES configs(id) not valid;

alter table "public"."documents" validate constraint "documents_config_id_fkey";

alter table "public"."documents" add constraint "documents_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."documents" validate constraint "documents_project_id_fkey";

alter table "public"."organizations_users" add constraint "organizations_users_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."organizations_users" validate constraint "organizations_users_organization_id_fkey";

alter table "public"."organizations_users" add constraint "organizations_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."organizations_users" validate constraint "organizations_users_user_id_fkey";

alter table "public"."projects" add constraint "projects_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."projects" validate constraint "projects_organization_id_fkey";

alter table "public"."template_mappings" add constraint "template_mappings_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."template_mappings" validate constraint "template_mappings_project_id_fkey";

alter table "public"."template_mappings" add constraint "template_mappings_template_id_fkey" FOREIGN KEY (template_id) REFERENCES templates(id) not valid;

alter table "public"."template_mappings" validate constraint "template_mappings_template_id_fkey";

alter table "public"."templates" add constraint "templates_config_id_fkey" FOREIGN KEY (config_id) REFERENCES configs(id) not valid;

alter table "public"."templates" validate constraint "templates_config_id_fkey";

alter table "public"."templates" add constraint "templates_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."templates" validate constraint "templates_project_id_fkey";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$function$
;

create policy "Access"
on "public"."assets"
as permissive
for all
to public
using (true)
with check (true);


create policy "Active project"
on "public"."configs"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));


create policy "Active project"
on "public"."documents"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));


create policy "Enable access to user's organizations"
on "public"."organizations"
as permissive
for select
to authenticated
using ((id IN ( SELECT organizations_users.organization_id
   FROM organizations_users
  WHERE ((organizations_users.organization_id = organizations.id) AND (organizations_users.user_id = auth.uid())))));


create policy "Enable access to user's organizations"
on "public"."organizations_users"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Enable access to authenticated users"
on "public"."projects"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable access to user's projects"
on "public"."projects"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT organizations_users.user_id
   FROM organizations_users
  WHERE (organizations_users.organization_id = projects.organization_id))));


create policy "Enable select for project claimed in JWT token"
on "public"."projects"
as permissive
for select
to anon
using ((project_id_from_access_token() = id));


create policy "Enable update to user's projects"
on "public"."projects"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Active project"
on "public"."template_mappings"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));


create policy "Active project."
on "public"."templates"
as permissive
for all
to anon, authenticated
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));


CREATE TRIGGER update_updated_at_column BEFORE UPDATE ON public.configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "Give users access to assets 1bqp9qb_0"
on "storage"."objects"
as permissive
for select
to anon, authenticated
using (true);


create policy "Give users access to assets 1bqp9qb_1"
on "storage"."objects"
as permissive
for insert
to anon, authenticated
with check (true);


create policy "Give users access to assets 1bqp9qb_2"
on "storage"."objects"
as permissive
for update
to anon, authenticated
using (true);


create policy "Give users access to assets 1bqp9qb_3"
on "storage"."objects"
as permissive
for delete
to anon, authenticated
using (true);