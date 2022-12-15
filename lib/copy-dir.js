import fsp from "fs/promises";
import path from "path";

export default async function copyDir(src, dest) {
    await fsp.mkdir(dest, { recursive: true });
    let entries = await fsp.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fsp.copyFile(srcPath, destPath);
    }
}
