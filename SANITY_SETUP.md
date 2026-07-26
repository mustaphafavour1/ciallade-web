# Ciallade — Setting up your Studio

This is the one-time setup for the **Ciallade Studio**, the place where you edit
the words and pictures on your website without touching any code.

You only do steps 1–5 once. After that you just open the Studio and type.

Total time: about 10 minutes.

---

## Step 1 — Get your Project ID

1. Go to **https://www.sanity.io/manage** and sign in.
2. Click your Ciallade project.
3. On the project overview page you'll see **Project ID** — a short code that
   looks something like `8kf2p1qz`.
4. Copy it. You'll paste it in Step 3.

While you're here, click **Datasets** in the left menu and note the dataset
name. It is almost always `production`.

---

## Step 2 — Create the API token

The token is a password that lets the setup script write your content into
Sanity. It must be an **Editor** token — a "Viewer" token can only read, and the
setup will fail.

1. Still inside your project on sanity.io/manage, click the **API** tab.
2. Click **Tokens** in the sub-menu.
3. Click **Add API token**.
4. Name it `Seed script` (any name works).
5. Under permissions choose **Editor**.
6. Click **Save**.

> **Important:** the token is shown **once**, right after you click Save.
> Copy it immediately. If you lose it, just delete that token and make a new one.

---

## Step 3 — Put both values in `.env.local`

In the project folder there is (or needs to be) a file named exactly:

```
.env.local
```

Open it in any text editor — or create it if it isn't there — and make sure it
contains these three lines, with your own values:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=paste-your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=paste-your-editor-token-here
```

No quotes and no spaces around the `=`. Save the file.

> `.env.local` is deliberately never uploaded to GitHub — your token stays on
> your computer. That's why it has to be created by hand.

---

## Step 4 — Fill the Studio with the current site content

Right now the Studio would open empty, even though the website is showing text
and photos (those are built-in placeholders inside the code). This command
copies all of that into Sanity so you can actually edit it.

In a terminal, from the project folder, run:

```bash
npm run seed
```

It takes a minute or two — most of the time is spent uploading photos. You'll
see it work through each section, then a summary like:

```
  Documents   26 written · 26 created · 0 updated
  Images      21 uploaded · 0 kept from Studio · 0 skipped
```

**You only need to run this once.**

### Re-running it later (safe)

The command is safe to run again — it updates the same documents rather than
creating duplicates, and it **will not touch photos you have uploaded
yourself**. Any text you changed in the Studio *will* be reset to the original
copy, so only re-run it if you want to start over.

If you also want the original placeholder photos back:

```bash
npm run seed -- --replace-images
```

If a photo fails to download, the script says so and carries on — the document
is still created, just without that image, and you can add one in the Studio.

---

## Step 5 — Allow your website to talk to Sanity (CORS)

Sanity blocks unknown websites by default. You have to list the addresses your
site runs on.

1. Go to **https://www.sanity.io/manage** → your project → **API** tab.
2. Find **CORS origins** and click **Add CORS origin**.
3. Add each of these, one at a time:

   | Origin | Allow credentials | What it's for |
   | --- | --- | --- |
   | `http://localhost:3000` | ✅ Yes | Working on the site on your own computer |
   | `https://your-site.vercel.app` | ✅ Yes | Your live Vercel site |
   | `https://ciallade.com` | ✅ Yes | Your custom domain, once connected |

   Replace `your-site.vercel.app` with your real Vercel address — you'll find it
   on your project page at **vercel.com**. If Vercel also gives you preview
   addresses you want the Studio to work on, add those too.

4. Save each one.

### Also tell Vercel about your project

So the live site can read your content, add the same two public values in
Vercel: your project on **vercel.com** → **Settings** → **Environment
Variables** → add

- `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID
- `NEXT_PUBLIC_SANITY_DATASET` = `production`

Then redeploy. (The `SANITY_API_TOKEN` is **not** needed on Vercel — it's only
used by the setup script on your computer. Don't put it there.)

---

## Opening the Studio

- On your computer: run `npm run dev`, then visit **http://localhost:3000/studio**
- On the live site: **https://your-site.vercel.app/studio**

Sign in with the same account you used on sanity.io.

**Remember to click Publish.** Edits are saved as a draft as you type; they only
appear on the live website once you hit the **Publish** button.

---

## What each Studio section controls

The left-hand menu in the Studio maps onto the website top to bottom.

### Site Contents

One page with tabs across the top. This holds every line of text on the home
page.

| Tab | What it changes on the site |
| --- | --- |
| **Hero** | The very first screen — the season badge, "Be Yourself.", "Reinvent Always.", the small paragraph at the bottom left and the button beside it |
| **The Edit** | Just the heading above the featured-pieces showcase. The garments themselves come from **Featured Pieces** below |
| **Philosophy** | The two headings, the long gold passage that fills in as you scroll, the tall photo beside it, and the "Our Story" link |
| **Explore** | Just the heading above the sliding category panels. The panels come from **Explore / Collections** below |
| **Editorial** | The centred campaign block — "Define the moment. / Own the frame.", the tall photo and its button |
| **Testimonials** | Just the heading above the customer carousel. The quotes come from **Testimonials** below |
| **Journey** | Just the heading above the scrolling year timeline. The years come from **Journey Milestones** below |
| **The Difference** | The "VERSUS" block — each row is one Ciallade statement, plus the crossed-out industry statement underneath, and the small symbol above it |
| **The Focus** | The three audience cards, then the dark 10-Year Vision block with the three big numbers that count up |
| **Footer & Social** | The bottom section with the giant scrolling CIALLADE wordmark, the closing headline, the button, the small footer links and your social media links |

**About "Title" and "Accent word":** most headings are split in two. The
**Title** is the plain part, and the **Accent word** is the last bit — it's
shown in gold with the underline that draws itself in. For example Title
`The` + Accent word `Edit` renders as "The **Edit**". Leave the Title empty if
you want the whole heading in gold.

To break a heading across two lines, press Enter inside the Title field.

### Explore / Collections

The five category panels in the Explore section: Ready-to-Wear, Headwear,
Statement Pieces, Bottoms and Jackets. Each has a label, a photo, a short
description and a display order (0 shows first).

Click into a collection and you get two options: **Edit collection**, and
**Pieces in this collection** — a filtered list of the garments that live
under it.

### Pieces

Every garment on the site. Each one has three tabs:

- **Details** — name, web address (slug), which collection it belongs to, the
  description, spec rows like Material / Care / Made in, the "Featured in The
  Edit" switch, and display order
- **Price & Stock** — price in ₦, an optional crossed-out compare-at price,
  available sizes, and the in-stock switch
- **Images** — the first image is the main one shown everywhere

### Featured Pieces (The Edit)

Not a separate list — it's the same pieces, filtered to those with **Featured in
"The Edit"** switched on. These are what cycle through the showcase on the home
page. Turn the switch on or off on any piece to add or remove it.

### Testimonials

The customer quotes in the carousel — name, location, quote, photo, and the
order they appear in.

### Journey Milestones

The year-by-year timeline. Year, title, description and order.

---

## If something goes wrong

**`npm run seed` says it can't find your credentials**
Re-check Step 3. The file must be named `.env.local` exactly (not
`env.local` or `.env.local.txt`) and sit in the project folder next to
`package.json`.

**The token was rejected**
The token needs the **Editor** role, not Viewer. Delete it on sanity.io/manage
(API → Tokens) and make a new one, then paste the new value into `.env.local`.

**The Studio loads but shows nothing / errors about CORS**
Step 5 — the address you're visiting from must be listed as a CORS origin.

**You changed something in the Studio but the site looks the same**
Click **Publish** on the document, then refresh. If it still looks the same
after a minute, hard-refresh the page (Ctrl/Cmd + Shift + R).

**A section shows the old wording no matter what you type**
Every section falls back to its built-in copy when the matching Sanity field is
left blank — so an empty field means "use the original". Type something in to
override it.
