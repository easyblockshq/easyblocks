drop policy "Enable update to user's projects" on "public"."projects";

create policy "Enable update to user's projects"
on "public"."projects"
as permissive
for update
to authenticated
using ((organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)))
with check ((organization_id IN ( SELECT organizations_id_of_user() AS organizations_id_of_user)));