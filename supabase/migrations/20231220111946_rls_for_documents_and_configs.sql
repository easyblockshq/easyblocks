drop policy "Active project" on "public"."configs";

drop policy "Active project" on "public"."documents";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.organizations_id_of_user()
 RETURNS SETOF uuid
 LANGUAGE sql
AS $function$
  select organization_id
  from organizations_users
  where user_id = auth.uid()
$function$
;

create policy "Only configs for documents owned by user's organization"
on "public"."configs"
as permissive
for select
to authenticated
using ((id IN ( SELECT documents.config_id
   FROM documents
  WHERE (documents.project_id IN ( SELECT projects.id
           FROM projects
          WHERE (projects.organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))))));


create policy "Enable access to documents owned by user's organizations"
on "public"."documents"
as permissive
for select
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))));


create policy "Active project"
on "public"."configs"
as permissive
for all
to anon
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));


create policy "Active project"
on "public"."documents"
as permissive
for all
to anon
using ((project_id_from_access_token() = project_id))
with check ((project_id_from_access_token() = project_id));