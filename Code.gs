/**
 * The Naked Alchemist's Grimoire — Drive Backup Receiver
 *
 * SETUP:
 * 1. Go to https://script.google.com → New Project.
 * 2. Delete the placeholder code and paste this whole file in.
 * 3. Change SECRET below to a password only you know (any random string).
 * 4. Click Deploy → New deployment → gear icon → "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, authorize when prompted (it's your own script, so this
 *    is safe), then copy the "Web app URL" it gives you.
 * 5. Paste that URL + your SECRET into the app's Dashboard → Backup
 *    settings.
 *
 * That's it — every save in the app will now land in a folder called
 * "Naked Alchemist's Grimoire Backups" in your Drive.
 */

const SECRET = "CHANGE-ME-TO-YOUR-OWN-SECRET";
const FOLDER_NAME = "Naked Alchemist's Grimoire Backups";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SECRET) {
      return jsonResponse({ error: "Unauthorized" });
    }
    if (!body.data) {
      return jsonResponse({ error: "No data provided" });
    }

    const folder = getOrCreateFolder(FOLDER_NAME);
    const json = JSON.stringify(body.data, null, 2);

    // Always overwrite the single "latest" copy — this is the file to
    // restore from if you ever need to.
    saveOrUpdateFile(folder, "latest.json", json);

    // Also keep one dated snapshot per day, so you have some history
    // without piling up a new file on every single edit.
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "UTC", "yyyy-MM-dd");
    saveOrUpdateFile(folder, `backup-${today}.json`, json);

    return jsonResponse({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

// Lets you open the Web app URL in a browser to sanity-check it's alive.
function doGet(e) {
  return jsonResponse({ status: "The Naked Alchemist's Grimoire backup endpoint is running." });
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function saveOrUpdateFile(folder, filename, content) {
  const files = folder.getFilesByName(filename);
  if (files.hasNext()) {
    const file = files.next();
    file.setContent(content);
  } else {
    folder.createFile(filename, content, MimeType.PLAIN_TEXT);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
