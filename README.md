# Square Expo Plugin

An Expo Config Plugin for the [Square In-App Payments SDK](https://developer.squareup.com/docs/in-app-payments-sdk/overview) that makes it easy to accept payments in your React Native app. This plugin handles all the necessary iOS and Android configuration for the Square SDK.

## Features

- Configures Apple Pay for iOS with merchant identifiers
- Adds Google Pay support for Android (optional)
- Handles all required build configurations for both platforms
- Sets up Square In-App Payments SDK build scripts correctly

## Installation

```bash
npm install --dev square-expo-plugin
# or
yarn add --dev square-expo-plugin
```

## Configuration

Add the plugin to your Expo config in `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "square-expo-plugin",
        {
          "merchantIdentifier": "merchant.com.yourcompany.app",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

### Configuration Options

| Option               | Type                   | Description                           | Default |
| -------------------- | ---------------------- | ------------------------------------- | ------- |
| `merchantIdentifier` | `string` or `string[]` | Apple Pay merchant identifier(s)      | []      |
| `enableGooglePay`    | `boolean`              | Enable Google Pay support for Android | `false` |

## Usage

After installing and configuring the plugin, you can use the Square In-App Payments SDK in your app:

```javascript
import { initializePaymentForm } from "react-native-square-in-app-payments";

// Follow Square SDK documentation for usage
```

Refer to the [Square React Native In-App Payments SDK documentation](https://github.com/square/in-app-payments-react-native-plugin) for complete usage instructions.

## Requirements

- Expo SDK 52 or higher
- react-native-square-in-app-payments ^1.7.6

## How It Works

This plugin:

1. Adds the required merchant identifiers for Apple Pay to your iOS entitlements
2. Creates a necessary Swift compatibility file
3. Configures the Square payment SDK build scripts
4. Sets up Google Pay metadata in Android Manifest (if enabled)

## Troubleshooting

### iOS

- If you see "Missing merchant identifier" errors, check that you've provided the correct `merchantIdentifier` in your plugin config
- Ensure you've set up your Apple Pay merchant account correctly in the Apple Developer Portal

### Android

- For Google Pay issues, verify your Square developer account is properly configured for Google Pay

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
