# Brown Town

An Alexa skill that plays brown noise on a seamless loop. No ads, no upsells, no subscriptions. Just noise.

> "I refuse to join any club that would have me as a member." — Groucho Marx

Especially one that charges a monthly fee for *brown noise*.

## Why this exists

I discovered brown noise out of necessity. I was living in a noisy neighborhood in NYC, and my neighbor had a habit of blasting their TV at 5am every single day. White noise wasn't cutting it — you could still hear the bass thumping through the wall. Brown noise, with its deeper, richer frequencies, turned out to be excellent at masking low-end bass sounds. It was a revelation. I've been hooked ever since.

For years I used one of the popular noise apps. Then, gradually, it got [enshittified](https://en.wikipedia.org/wiki/Enshittification). First came the banner ads. Then full-screen interstitials. Then "premium" tiers. Eventually, *brown noise* — the most basic, algorithmically generated sound imaginable — was locked behind a subscription paywall. A membership. For noise.

So I built my own.

## What it does

Say **"Alexa, open Brown Town"** and it starts playing deep, warm brown noise. It loops seamlessly all night. No timers, no interruptions — it plays until you say stop.

Some things it will say to you on the way in:

- *"All aboard the sleepy train to Brown Town."*
- *"Passport to Brown Town: approved. Consciousness: revoked."*
- *"This is your captain speaking. We are beginning our descent into Brown Town."*

## How it works

- An **Alexa custom skill** backed by an **AWS Lambda** function
- Streams a brown noise MP3 from **S3** via the Alexa AudioPlayer interface
- When playback nears the end, it enqueues the same track again for a gapless loop
- Deployed across NA, EU, and FE regions

## Project structure

```
├── skill.json                          # Alexa skill manifest
├── interactionModels/custom/en-US.json # Voice interaction model
└── lambda/
    ├── index.js                        # Lambda handler (skill logic)
    ├── util.js                         # S3 utility
    └── package.json                    # Dependencies (ask-sdk-core)
```

## Usage

```
"Alexa, open Brown Town"
"Alexa, take me to Brown Town"
"Alexa, stop"
```

## Deploying your own

1. Create an Alexa skill in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Set up an AWS Lambda function with the code in `lambda/`
3. Host your own brown noise MP3 in S3 (or wherever) and update the `AUDIO_URL` in `index.js`
4. Connect the Lambda ARN to your skill endpoint
5. Never pay for noise again
