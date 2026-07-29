# The Naked Alchemist's Grimoire — React Native / Expo App

This is a React Native conversion of your web app, built for Expo. It covers
all seven sections (Dashboard, Sales, Recipes, Inventory, Expenses, Products,
Batch Log) with the same data, calculations, and pack logic (5 Bar Sample
Pack, 3 Bar Custom Pack), plus local persistence and photo-scan batch entry.

## Getting this into Expo Snack (snack.expo.dev)

Snack doesn't accept a zip upload directly, so the most reliable way in is
to recreate the file structure by hand — it only takes a few minutes:

1. Go to **https://snack.expo.dev** and start a new Snack.
2. In the left file panel, delete the placeholder `App.js` content and
   paste in this project's `App.js`.
3. Use the **"+"** button in the file panel to create each additional file
   below, matching the path exactly, and paste in its contents:
   - `data.js`
   - `theme.js`
   - `context/DataContext.js` (use "+" → "Create folder" if needed, or just
     type `context/DataContext.js` as the filename — Snack will nest it)
   - `screens/Dashboard.js`
   - `screens/Sales.js`
   - `screens/Recipes.js`
   - `screens/Inventory.js`
   - `screens/Expenses.js`
   - `screens/Products.js`
   - `screens/Batches.js`
4. Open the **"Dependencies"** panel (left sidebar) and add these packages —
   Snack usually detects them automatically from the `import` statements and
   prompts you to install, but if not, add manually:
   - `@react-native-async-storage/async-storage`
   - `@react-native-picker/picker`
   - `expo-image-picker`
5. Once all files are in and dependencies are installed, the app should
   run immediately in the Snack web preview.

**Alternative (faster if you're comfortable with GitHub):** push this whole
folder to a GitHub repo, then in Snack use **"Import git repository"** and
paste the repo URL — that pulls in every file at once instead of manual
copy-paste.

## Running it on your Android phone right now

1. Install the **Expo Go** app from the Google Play Store.
2. With your Snack open, tap the **QR code icon**.
3. Scan it with the Expo Go app (or the phone's camera) — the app opens
   live on your phone. No build step needed for this.

## Turning it into an installable Android app (APK)

Once your code is pushed to GitHub, the easiest path needs **nothing
installed on your computer** — it all happens through Expo's website by
connecting your GitHub repo.

**One-time setup:**

1. Add the `eas.json` file included in this project to your repo (same
   drag-and-drop-via-github.dev trick as before, if you haven't already).
   This tells Expo's build servers to produce a plain installable `.apk`
   file instead of the Play Store bundle format.
2. Go to **expo.dev** and create a free account.
3. Click **Create a project**, and when asked, choose to import from
   GitHub — authorize Expo to access your `TNA-Grimoire` repo.

**Every time you want a fresh APK:**

1. From your project's page on expo.dev, go to the **Builds** tab.
2. Click **Create a build**, choose **Android**, and select the
   **preview** profile (that's the one set up to produce an `.apk`).
3. Pick the `main` branch. Expo builds it in the cloud — takes roughly
   10–20 minutes.
4. When it finishes, you get a page with a **QR code and download link**.
   Scan it with your phone, or just open the link on your phone's
   browser, and it downloads the `.apk` directly.
5. Tap the downloaded file to install. Android will likely prompt you to
   allow "install unknown apps" for your browser/file manager the first
   time — that's expected for anything installed outside the Play Store.

That's it — a real app icon on your home screen, no Play Store
submission needed.

**Alternative: from your own computer**, if you'd rather not use the
website flow — this needs Node.js installed locally:
```
npm install -g eas-cli
eas login
git clone https://github.com/alexbryce626-hash/TNA-Grimoire.git
cd TNA-Grimoire
npm install
eas build --platform android --profile preview
```
Same result — a download link for the `.apk` at the end.

Either way, the build is free under Expo's personal-use tier (a
reasonable number of builds per month at no cost).


## Settings menu (gear icon)

There's now a gear icon in the top-right of the header that opens a
Settings sheet with two sections:

- **Appearance** — pick from 5 color palettes (Apothecary, Botanical,
  Blush, Midnight, Monochrome), a font (System / Serif / Monospace), and
  a layout density (Comfortable / Compact for tighter spacing on smaller
  screens). Changes apply instantly across every screen and are saved
  locally, so they persist between sessions. There's a "Reset to default
  look" link if you want to go back to the original styling.
- **Drive Backup** — the backup URL/secret fields and status that used
  to live on the Dashboard now live here instead, to keep the Dashboard
  focused on your numbers.

If you're updating an existing Snack/GitHub copy of this project rather
than starting fresh, the files that changed or are new in this update
are: `App.js`, `theme.js`, `context/DataContext.js` (unchanged from
before, included for completeness), `context/ThemeContext.js` (new),
`screens/Settings.js` (new), and every file in `screens/` (all updated
to pull their colors/fonts/spacing from the new theme system instead of
fixed values).

## Automatic Google Drive backups

Every save in the app (a sale, an expense, an edited recipe, a logged
batch — anything) can now automatically push a fresh backup of your data
to a folder in your Google Drive. This uses a small Google Apps Script
instead of full Google OAuth, which keeps setup to a few clicks instead of
wrestling with a Google Cloud Console project.

**Setup (about 5 minutes, one time):**

1. Go to **script.google.com** → **New project**.
2. Delete the placeholder code, and paste in the contents of
   `google-apps-script/Code.gs` from this project.
3. In the script, change the `SECRET` constant near the top to any random
   string of your choosing — this is what stops anyone else from writing
   to your Drive even if they somehow found the URL.
4. Click **Deploy → New deployment**, click the gear icon and choose
   **Web app**. Set "Execute as" to **Me** and "Who has access" to
   **Anyone**. Click **Deploy**, and approve the permissions prompt (it's
   your own script asking for access to your own Drive — normal and
   expected).
5. Copy the **Web app URL** it gives you.
6. In the app, open the **Dashboard** tab, tap **"Drive Backup"** to
   expand the settings, and paste in the Web app URL and the secret you
   chose. Tap **Save Backup Settings**.

From then on, every edit anywhere in the app silently pushes an updated
`latest.json` to a folder called **"Naked Alchemist's Grimoire Backups"**
in your Drive, plus one dated snapshot per day so you have some history
to fall back on. The Dashboard shows the status of the most recent backup
("Backed up 2:14 PM", or a note if one failed), and there's a manual
"Back up now" link if you want to force one.

**Restoring from a backup:** open `latest.json` (or any dated snapshot)
from that Drive folder, copy its contents, and it's the same JSON shape
the app already stores locally — useful if you ever reinstall the app or
switch phones.


- **Data storage:** Uses `@react-native-async-storage/async-storage`
  instead of the browser storage the web version used — this is local to
  the phone the app is installed on. It does not sync with the web
  version's saved data; you're starting fresh with the same seed data
  from your spreadsheet.
- **Photo scanning of notebook batches:** This feature calls the
  Anthropic API directly from the phone, which means it needs your own
  Anthropic API key (the web artifact version had this handled
  automatically; a standalone app doesn't have that). In the Batch Log
  screen, tap "Set Anthropic API key" and paste a key from
  console.anthropic.com — it's saved locally on your phone. If you'd
  rather not manage an API key on the client, the photo-scan button can
  be removed easily (delete the `scanNotebook` call and the button in
  `screens/Batches.js`) and everything else still works.
- **Camera permission:** The app will ask for camera access the first
  time you tap "Scan from Notebook."
- This is a functional first pass, not a pixel-perfect match to the web
  version — some visual polish (the custom fonts, the softer card
  styling) can be refined further once you've seen it running.
