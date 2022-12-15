import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import copyDir from "../../lib/copy-dir.js"

// Emulating __filename and __dirname constants
// Avoids "__dirname is not defined in ES module scope" error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds APK file and saves it in /build/android/cordova/output/game.apk
 */
async function buildAndroid() {
    // Copy contents of /game/ to /build/android/cordova/www
    const gamePath = path.join(__dirname, "..", "..", "game");
    const gameTargetPath = path.join(__dirname, "cordova", "www");
    fs.existsSync(gameTargetPath) && fs.rmSync(gameTargetPath, { recursive: true, force: true });
    fs.mkdirSync(gameTargetPath);
    await copyDir(gamePath, gameTargetPath);

    // Call cordova to build the APK file
    `
    cordova create myApp com.myCompany.myApp myApp 
    cordova requirements android 
    cordova build android --verbose 
    `;
}

await buildAndroid();