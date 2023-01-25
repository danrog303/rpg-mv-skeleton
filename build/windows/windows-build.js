import path from "path";
import fs from "fs";
import fse from "fs-extra";
import {fileURLToPath} from "url";
import zipper from "zip-local";
import gameMetadata from "../../game-metadata.js";

// Emulating __filename and __dirname constants
// Avoids "__dirname is not defined in ES module scope" error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds windows release and saves it in /build/windows/output/
 */
async function buildWindows() {
    console.log("Building Windows release...");

    console.log("Copying contents of /game/ to /build/windows/wrapper/www")
    const gamePath = path.join(__dirname, "..", "..", "game");
    const gameTargetPath = path.join(__dirname, "wrapper", "www");
    fse.removeSync(gameTargetPath);
    fs.mkdirSync(gameTargetPath);
    fse.copySync(gamePath, gameTargetPath, {overwrite: true});

    console.log("Zipping /build/windows/wrapper/");
    const zipInputPath = path.join(__dirname, "wrapper");
    const zipOutputFileName = `${gameMetadata.code}-${gameMetadata.version}-win.zip`;
    const zipOutputDir = path.join(__dirname, "output");
    const zipOutputPath = path.join(zipOutputDir, zipOutputFileName);
    fse.mkdirsSync(zipOutputDir, {});
    zipper.sync.zip(zipInputPath).compress().save(zipOutputPath);

    console.log("\nWindows release has been compiled successfully.");
    console.log("Path: " + zipOutputPath);
}

await buildWindows();