import fs from "fs";
import path from "path";

const storagePath = path.join(process.cwd(), "public/storage");
const metadataFile = path.join(storagePath, "metadataDoc.json");

export async function GET() {
  try {
    if (!fs.existsSync(storagePath)) {
      return new Response(
        JSON.stringify({ error: "Тека storage не знайдена" }),
        { status: 404 },
      );
    }

    let metadata = { documents: [] };
    if (fs.existsSync(metadataFile)) {
      metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
    }

    // 🔹 Скануємо всі файли в папці storage
    const folders = fs
      .readdirSync(storagePath)
      .filter((item) =>
        fs.statSync(path.join(storagePath, item)).isDirectory(),
      );

    folders.forEach((folder) => {
      const folderPath = path.join(storagePath, folder);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => fs.statSync(path.join(folderPath, file)).isFile());

      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const fileStats = fs.statSync(filePath);
        let createdAt = fileStats.birthtime.toISOString().split("T")[0];

        // 🔹 Якщо `birthtime` підозрілий, використовуємо `mtime`
        if (createdAt === new Date().toISOString().split("T")[0]) {
          createdAt = fileStats.mtime.toISOString().split("T")[0];
        }

        // 🔹 Додаємо документ до `metadataDoc.json`, якщо його там немає
        if (!metadata.documents.some((doc) => doc.name_eng === file)) {
          metadata.documents.push({
            name_eng: file,
            folder_eng: folder,
            folder_ukr: "", // Пізніше можна додати відповідність українських назв
            description: "",
            shareholder_only: false,
            metatag: "",
            created_at: createdAt,
            uploaded_at: new Date().toISOString().split("T")[0], // Дата оновлення
            lost: false,
          });
        }
      });
    });

    // 🔹 Оновлюємо `metadataDoc.json`
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    return new Response(
      JSON.stringify({ message: "Документи оновлено", metadata }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Помилка сканування" }), {
      status: 500,
    });
  }
}
