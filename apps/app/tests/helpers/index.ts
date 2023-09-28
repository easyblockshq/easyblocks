import { Session, SupabaseClient } from "@supabase/supabase-js";

async function createTestUserAndSignIn(supabase: SupabaseClient) {
  const testUserEmail = "test_user@shopstory.app";

  await supabase.auth.admin.createUser({
    email_confirm: true,
    email: testUserEmail,
    password: "12345678",
  });

  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: testUserEmail,
    password: "12345678",
  });

  if (error) {
    console.log(error);
    throw error;
  }

  const { data: testUserDemoProject } = await supabase
    .from("projects")
    .select()
    .eq("type", "demo")
    .single();

  return {
    session,
    demoProject: testUserDemoProject,
  };
}

async function removeTestUser(supabase: SupabaseClient, session: Session) {
  // Remove all access to projects
  const { data: removedProjectsAccess, error } = await supabase
    .from("projects_users")
    .delete()
    .match({
      user_id: session.user.id,
    })
    .select();

  // Remove all projects
  await supabase
    .from("projects")
    .delete()
    .in(
      "id",
      removedProjectsAccess!.map((p) => p.project_id)
    )
    .select();

  // Finally remove the user
  await supabase.auth.admin.deleteUser(session.user.id);
}

const ACCESS_TOKEN_HEADER = "x-shopstory-access-token";

export { createTestUserAndSignIn, removeTestUser, ACCESS_TOKEN_HEADER };
