import type { Actions, PageServerLoad } from "./$types";
import { existsSync, mkdirSync } from "fs";
import SQLite from "better-sqlite3";
import { writeFile, rm } from "fs/promises";
import { Readable } from "stream";
import { fail } from "@sveltejs/kit";

if (!existsSync("data")) mkdirSync("data");
const db = new SQLite("data/images.db");
db.exec(`CREATE TABLE IF NOT EXISTS images (
  src TEXT PRIMARY KEY,
  caption TEXT,
  date INTEGER,
  size INTEGER
)`);

const selectImages = db.prepare("SELECT * FROM images ORDER BY date DESC");
const insertImage = db.prepare(
  "INSERT INTO images VALUES (?, '', unixepoch() * 1000, ?)"
);
const deleteImage = db.prepare("DELETE FROM images WHERE src = ?");
const updateImage = db.prepare("UPDATE images SET caption = ? WHERE src = ?");

export const load: PageServerLoad = ({ params }) => {
  const images = selectImages.all() as {
    caption: string;
    date: number;
    size: number;
    src: string;
  }[];
  return { images };
};

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();
    const images = data.getAll("images") as File[];
    const promises = images.map(async (file) => {
      const src = `uploaded/${crypto.randomUUID()}.jpg`;
      const stream = Readable.fromWeb(file.stream() as any);
      insertImage.run(src, file.size);
      if (!existsSync("static/uploaded")) mkdirSync("static/uploaded");
      return writeFile("./static/" + src, stream);
    });
    await Promise.all(promises);
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const target = data.get("src")?.toString();
    if (!target) return fail(400);
    if (deleteImage.run(target).changes) await rm("./static/" + target);
  },
  caption: async ({ request }) => {
    const { caption, src } = await request
      .formData()
      .then((x) => ({ caption: x.get("caption"), src: x.get("src") }));
    if (typeof caption !== "string") return fail(400);
    if (typeof src !== "string") return fail(400);
    updateImage.run(caption, src);
  },
} satisfies Actions;
