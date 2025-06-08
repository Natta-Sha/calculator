import express from "express";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs/promises";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Идентификатор таблицы и имя листа
const SPREADSHEET_ID = "Т1nFX8jpPZT5dsBOtv0o7m83EXOtXy8EQvrGGjWJNfR44"; // <-- Вставь сюда ID таблицы
const SHEET_NAME = "Sheet1";

async function authorize() {
  const credentials = JSON.parse(
    await fs.readFile("./oauth2.keys.json", "utf-8")
  );
  const token = JSON.parse(await fs.readFile("./token.json", "utf-8"));
  const { client_id, client_secret, redirect_uris } = credentials.web;

  const auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  auth.setCredentials(token);
  return auth;
}

app.post("/append", async (req, res) => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });

    const { value } = req.body;

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [[value]],
      },
    });

    res.status(200).send("Data appended successfully");
  } catch (error) {
    console.error("Error appending data:", error);
    res.status(500).send("Error appending data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
