import { AndroidConfig, ConfigPlugin } from "expo/config-plugins";
type SquarePluginProps = {
    /**
     * The iOS merchant ID used for enabling Apple Pay.
     * Without this, the error "Missing merchant identifier" will be thrown on iOS.
     */
    merchantIdentifier: string | string[];
    enableGooglePay: boolean;
};
/**
 * Adds the following to the entitlements:
 *
 * <key>com.apple.developer.in-app-payments</key>
 * <array>
 *	 <string>[MERCHANT_IDENTIFIER]</string>
 * </array>
 */
export declare function setApplePayEntitlement(merchantIdentifiers: string | string[], entitlements: Record<string, any>): Record<string, any>;
/**
 * Add a blank Swift file to the Xcode project for Swift compatibility.
 */
export declare const withNoopSwiftFile: ConfigPlugin;
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
export declare function setGooglePayMetaData(enabled: boolean, modResults: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
declare const _default: ConfigPlugin<SquarePluginProps>;
export default _default;
