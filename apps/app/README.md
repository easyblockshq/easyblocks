# Requirements

These should be available globally:

- [Docker](https://www.docker.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Backend

If you want to work with local version of Supabase database you have to setup valid value of `NEXT_PUBLIC_SHOPSTORY_SUPABASE_ACCESS_TOKEN`

```


# Development

To start development run `dev` script from within `packages/core` directory. It will start in parallel:
- Next JS app to access development version of editor
- Next JS app that serves as our backend layer
- Supabase Client that serves as our database layer
```
