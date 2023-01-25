import path from "path";
import fs from "fs";
import fse from "fs-extra";
import mapReplace from "mapreplace";
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';
import gameMetadata from "../../game-metadata.js";

// Emulating __filename and __dirname constants
// Avoids "__dirname is not defined in ES module scope" error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds APK file and saves it in /build/android/cordova/output/game.apk
 */
async function buildAndroid() {
    console.log('Copying contents of /build/android/cordova to /build/android/cordova-temp');
    const cordovaDir = path.join(__dirname, "cordova");
    const cordovaTempDir = path.join(__dirname, "cordova-temp");
    fse.removeSync(cordovaTempDir);
    fse.copySync(cordovaDir, cordovaTempDir, {overwrite: true});

    console.log("Copying contents of /game/ to /build/android/cordova-temp/www/");
    const gamePath = path.join(__dirname, "..", "..", "game");
    const gameTargetPath = path.join(__dirname, "cordova-temp", "www");
    fse.removeSync(gameTargetPath);
    fse.mkdirsSync(gameTargetPath, {});
    fse.copySync(gamePath, gameTargetPath, {overwrite: true});

    console.log("Filling blanks in Cordova configuration files")
    const configXmlFilePath = path.join(__dirname, "cordova-temp", "config.xml");
    const packageJsonFilePath = path.join(__dirname, "cordova-temp", "package.json");
    let configXmlFileContent = fs.readFileSync(configXmlFilePath, 'utf-8');
    let packageJsonFileContent = fs.readFileSync(packageJsonFilePath, 'utf-8');
    const replacementMap = {
        "${gameCodeName}": gameMetadata.code,
        "${androidPackageName}": gameMetadata.android.packageName,
        "${androidAppName}": gameMetadata.android.appName,
        "${androidAppVersion}": gameMetadata.android.appVersion,
    };
    configXmlFileContent = mapReplace(configXmlFileContent, replacementMap);
    packageJsonFileContent = mapReplace(packageJsonFileContent, replacementMap);
    fs.writeFileSync(configXmlFilePath, configXmlFileContent);
    fs.writeFileSync(packageJsonFilePath, packageJsonFileContent);

    console.log("Calling Cordova to build the APK file")
    const opts = {stdio: "inherit"};
    execSync(`cd "${cordovaTempDir}" && cordova telemetry off`, opts);
    execSync(`cd "${cordovaTempDir}" && cordova platform add android`, opts);
    execSync(`cd "${cordovaTempDir}" && cordova requirements android`, opts);
    execSync(`cd "${cordovaTempDir}" && cordova build android --release --verbose -- --packageType=apk`, opts);

    console.log("Creating output directory and copying generated APK to /build/android/output");
    const outputDirPath = path.join(__dirname, "output");
    const outputFilePath = path.join(outputDirPath, `${gameMetadata.code}-${gameMetadata.version}.apk`);
    const generatedApkPath = path.join(__dirname, "platforms", "android", "app", "build", "outputs",
        "apk", "release", "app-release-unsigned.apk");
    fse.mkdirsSync(outputDirPath, {});
    fse.copySync(generatedApkPath, outputFilePath);

    console.log("Deleting /build/android/cordova-temp")
    fse.removeSync(cordovaTempDir);

    console.log("\nAndroid release has been compiled successfully.");
    console.log("Path: " + outputFilePath);
}

await buildAndroid();