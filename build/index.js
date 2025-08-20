"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withNoopSwiftFile = void 0;
exports.setApplePayEntitlement = setApplePayEntitlement;
exports.setGooglePayMetaData = setGooglePayMetaData;
/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
const config_plugins_1 = require("expo/config-plugins");
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow, removeMetaDataItemFromMainApplication, } = config_plugins_1.AndroidConfig.Manifest;
const pkg = require("react-native-square-in-app-payments/package.json");
const withSquareIos = (expoConfig, { merchantIdentifier = [] }) => {
    return (0, config_plugins_1.withEntitlementsPlist)(expoConfig, (config) => {
        config.modResults = setApplePayEntitlement(merchantIdentifier, config.modResults);
        return config;
    });
};
const withSquareXCodeProject = (config) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (conf) => {
        const project = conf.modResults;
        project.addBuildPhase([], "PBXShellScriptBuildPhase", "Square Framework Run Script - InAppPaymentsSDK", project.getFirstTarget().uuid, {
            shellPath: "/bin/sh",
            shellScript: 'FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}" && "${FRAMEWORKS}/SquareInAppPaymentsSDK.framework/setup"',
        });
        return conf;
    });
};
const withReorderSquareBuildPhase = (config) => {
    return (0, config_plugins_1.withPodfile)(config, (config) => {
        const target = config.modRequest.projectName;
        const regex = new RegExp(`(target '${target}' do.*(?:  end))(\\nend)`, "s");
        config.modResults.contents = config.modResults.contents.replace(regex, "$1\n" +
            "\n" +
            "  post_integrate do |installer|\n" +
            `    system("ruby ../node_modules/square-expo-plugin/scripts/fix-build-phases.rb ${target}.xcodeproj ${target}")\n` +
            "  end" +
            "$2");
        return config;
    });
};
const withSquare = (config, props = {}) => {
    config = withSquareIos(config, props);
    config = (0, exports.withNoopSwiftFile)(config);
    config = withSquareAndroid(config, props);
    config = withSquareXCodeProject(config);
    config = withReorderSquareBuildPhase(config);
    return config;
};
/**
 * Adds the following to the entitlements:
 *
 * <key>com.apple.developer.in-app-payments</key>
 * <array>
 *	 <string>[MERCHANT_IDENTIFIER]</string>
 * </array>
 */
function setApplePayEntitlement(merchantIdentifiers, entitlements) {
    const key = "com.apple.developer.in-app-payments";
    const merchants = entitlements[key] ?? [];
    if (!Array.isArray(merchantIdentifiers)) {
        merchantIdentifiers = [merchantIdentifiers];
    }
    for (const id of merchantIdentifiers) {
        if (id && !merchants.includes(id)) {
            merchants.push(id);
        }
    }
    if (merchants.length) {
        entitlements[key] = merchants;
    }
    return entitlements;
}
/**
 * Add a blank Swift file to the Xcode project for Swift compatibility.
 */
const withNoopSwiftFile = (config) => {
    return config_plugins_1.IOSConfig.XcodeProjectFile.withBuildSourceFile(config, {
        filePath: "noop-file.swift",
        contents: [
            "//",
            "// @generated",
            "// A blank Swift file must be created for native modules with Swift files to work correctly.",
            "//",
            "",
        ].join("\n"),
    });
};
exports.withNoopSwiftFile = withNoopSwiftFile;
const withSquareAndroid = (expoConfig, { enableGooglePay = false }) => {
    return (0, config_plugins_1.withAndroidManifest)(expoConfig, (config) => {
        config.modResults = setGooglePayMetaData(enableGooglePay, config.modResults);
        return config;
    });
};
/**
 * Adds the following to AndroidManifest.xml:
 *
 * <application>
 *   ...
 *	 <meta-data
 *     android:name="com.google.android.gms.wallet.api.enabled"
 *     android:value="true|false" />
 * </application>
 */
function setGooglePayMetaData(enabled, modResults) {
    const GOOGLE_PAY_META_NAME = "com.google.android.gms.wallet.api.enabled";
    const mainApplication = getMainApplicationOrThrow(modResults);
    if (enabled) {
        addMetaDataItemToMainApplication(mainApplication, GOOGLE_PAY_META_NAME, "true");
    }
    else {
        removeMetaDataItemFromMainApplication(mainApplication, GOOGLE_PAY_META_NAME);
    }
    return modResults;
}
exports.default = (0, config_plugins_1.createRunOncePlugin)(withSquare, pkg.name, pkg.version);
