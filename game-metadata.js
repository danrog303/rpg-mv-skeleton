// Global metadata
const gameMetadata = {
    // Game title
    title: "My test game",

    // Game version in (MAJOR.MINOR.PATCH format)
    version: "1.0.0",

    // Simplified name, used for naming output files
    code: "my-test-game"
};

// Metadata specific for Android release
gameMetadata.android = {
    appName: gameMetadata.title,
    appVersion: gameMetadata.version,
    packageName: "com.github.danrog303.rpgmvskel"
}

export default gameMetadata;
