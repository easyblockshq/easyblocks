Before you run this project run `npm install` in root directory. After that, you can start local development server by running `npm run dev`.

Easyblocks content is structured in the following way:

- there are 3 documents types declared
- `AppShell` document represents layout and has a "slot" for content based on context where it's used
- `WelcomeScreen` document represents content that's displayed within the slot of `AppShell` on home page
- `AssetsScreen` documents represents content that's displayed within the slot of `AppShell` on asset's details page

You can edit any of these documents on `/edit` page.

This demo uses cloud version of Easyblocks (documents are stored in our backend), cloudless option is also possible.

The content of specific documents is bound to user session (document ids are stored in cookies) so that each user that runs a demo has his/her own demo. Obviously in real implemenation documents would be shared between users.
