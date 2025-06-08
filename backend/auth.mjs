import { google } from "googleapis";
import fs from "fs/promises";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const CREDENTIALS_PATH = "./oauth2.keys.json"; // твой файл с client_id, client_secret
const TOKEN_PATH = "./token.json"; // сюда запишется токен

async function authorize() {
  // 1. Читаем credentials
  const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  // 2. Создаем OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // 3. Генерируем URL для авторизации
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // получить refresh_token
    prompt: "consent", // важно: иначе refresh_token не вернется повторно
    scope: SCOPES,
  });

  console.log("👉 Open this URL in your browser:\n", authUrl);

  // 4. Слушаем ввод кода из терминала
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (code) => {
    code = code.trim();
    try {
      // 5. Получаем токены по коду
      const { tokens } = await oAuth2Client.getToken(code);
      // 6. Сохраняем токены в файл
      await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
      console.log("✅ Token saved to", TOKEN_PATH);
      process.exit();
    } catch (err) {
      console.error("❌ Error retrieving access token", err);
      process.exit(1);
    }
  });
}

authorize();
