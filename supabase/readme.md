# Local Supabase secret

For local development Supabase uses the following value as secret
"super-secret-jwt-token-with-at-least-32-characters-long"

# Making changes to the database

## Migrations

1. Run a database locally.
2. Make any schema changes you want via Supabase Admin Panel or with code.
3. In order to find a schema diff between initial database and database after your changes, just run `supabase db diff`
4. Saving this diff to `migrations/` will "seal" those changes. Just run `supabase db diff -f the_name`. Supabase will automatically add timestamps.

I really like how smart Supabase diffing is. When running `supabase db diff` it automatically creates new "shadow db" based on current migrations and seed so that it knows the initial state. Then compares current state against this init state. Very easy and cool!

## Publishing to production
