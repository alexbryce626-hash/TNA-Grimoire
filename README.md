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

## Turning it into an installable Android app (APK/AAB)

Snack itself is a live-preview sandbox, not a build service. To get a real
installable app icon on your phone:

1. Move this project from Snack to your own machine (or export it —
   Snack has a "Download" / "Export" option that gives you the project as
   a zip you can `npm install` locally).
2. Install the EAS CLI: `npm install -g eas-cli`
3. From the project folder: `eas login`, then `eas build:configure`
4. Run: `eas build --platform android --profile preview`
5. EAS builds it in the cloud and gives you a link to download the `.apk`
   directly to your phone (no Play Store submission needed for personal use).

This part requires a free Expo account; the build itself is free for
personal/small-scale use under Expo's free tier limits.

## Important notes

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
