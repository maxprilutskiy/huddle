# Huddle

Huddle - A Networking Companion for Builders & Startup Founders

## What is Huddle?

Huddle is a networking app aimed at builders, indie hackers, and startup founders.

It's a platform where individuals with similar interests can find each other to share knowledge, exchange experiences, and offer mutual support.

## How it works?

The app functions similarly to Tinder but is intended for professional networking. The process starts when new users sign up and provide details about their professional background, experiences, and current challenges.

They also identify the type of individuals they want to network with.

Subsequently, Huddle presents them with a curated selection of potential matches based on their profile. If there's a match, the platform schedules a video call for both parties, thereby streamlining the networking process.

## What's the tech stack?

**TLDR:**

* LlamaIndex
* Zilliz
* Google Vertex AI
* Postgres (Supabase)
* TruLens (Eval)

**Tech solution**

Huddle uses Llamaindex and the Zilliz vector database to store user-specific embeddings. These embeddings are generated via a model built on Google's Vertex platform.

When users sign up, embeddings are generated from their profile information, and are put into the Zilliz vector database. Later down the road, when it's time for the app to generate profile suggestions for a given user, similar (cosine distance) vectors are taken from the database, related user profile records are retrieved, and shown to the user.

For the user data, we're using supabase.

Truera's Trulens Eval is a fantastic option here too, as it ensures a faster development pace and iteration on LLM app quality, and guarantees a working prototype within quite short timeframes of the hackathon.

![TruLens Image](/trulens.png)