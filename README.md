# News Haiku

This repo is a hobby side-project to play a bit with Google LLM API.
This app has the following features:
* Daily creation of new haikus based on recent news articles.
* Possibility to create new haikus by choosing an article and tweaking parameters
* Possibility to save one's generated haikus

# Tech involved
* The app is based on [Next.js](https://nextjs.org/) coded in TypeScript.
* It uses the [Guardian API](https://open-platform.theguardian.com) to download news articles details
* It saves the news articles and the haikus in [FireStore](https://firebase.google.com/docs/firestore/)
* It uses the [Google Gemini API](https://ai.google.dev/) to use Large Language Models
* It uses [Clerk](https://clerk.com) for auth and user management

# Thank you to
* The Guardian for putting such a big amount of data in open access
* Vercel, Google, Clerk for putting such awesome tools with great free tiers

# Running it locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Necessary environment variables for local run
* `GUARDIAN_API_KEY` to fetch the news with the Guardian API
* `GOOGLE_API_KEY` is the key which allows to access the google GEMINI model
* `FIREBASE_USER`, `FIREBASE_PWD` and `FIREBASE_UID` are given by Firebase when you create a project
* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are given by Clerk when you create a project.

# Ways to improve the app
I often heard that the biggest room in the world is the room for improvement.
* The quality of the model answers leaves to be desired, even though sometimes the AI nails it on the head.
There is some progress to be made regarding prompt engineering, to enhance haiku quality.
* If people can rank each haiku, we could (with enough traction) generate crowd-sourced stats regarding which prompt / which hyper-parameters give consistently the best results.

