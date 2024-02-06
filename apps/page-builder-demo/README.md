# Easyblocks Page Builder Example

This repository serves as an example of how you can use Easyblocks to create a page builder.

## Installation

`npm install`

## Add an access token

Easyblocks editor requires an external service for saving, updating and versioning of your documents and templates. In order to play around with this demo we recommend using our simple and free cloud service. You'll be able to provide your custom one later (read [here](https://docs.easyblocks.io/essentials/backend) for more info).

1. Go to [https://app.easyblocks.io](https://app.easyblocks.io) and create a free account.
2. Go to "Playground project"
3. Copy acccess token
4. Create `.env.local` file and assign the acquired token to `NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN` environment variable.

## Run

`npm run dev`
