# BLUEPRINT 2.0 — English Y2K Edition

**Student:** chayanis nusati  
**Platform:** React Native / Expo, Android APK  
**Design:** pink, lavender, chrome-inspired SVG stickers and retro desktop windows.

All app-authored screens, messages, instructions and source comments are English. Text returned by an external device is preserved unchanged for accurate evidence. System permission dialogs follow the phone's language settings.

## The assignment

Based on `Sample Code of Bluetooth.pdf`:

1. Scan for and connect to the instructor's BLE device.
2. Discover and verify the service and characteristic.
3. Read the initial characteristic value.
4. Write a text value containing your name (and a buddy's name when required).
5. Read the same characteristic again to obtain the device's response / predicted grade.
6. Capture the real screens and submit them to Google Classroom.
7. Disconnect when finished.

The app never generates grades in live mode. Empty values and non-grade messages are displayed as returned.

```text
SERVICE_UUID = aee04821-1973-4e1f-a590-e84b10d580e7
CHAR_UUID    = cde07b1a-889b-44b7-a99f-c888dddac729
```

The scan accepts all nearby BLE advertisements because a peripheral may not advertise its service UUID. UUIDs are verified after connection. The PDF's example device name is `Mobile App 169`; the actual name may differ.

## Name and buddy option

The default write value is exactly:

```text
chayanis nusati
```

No buddy name is prefilled. **Include a buddy** is off by default. The original assignment asks for both names: enable this option and enter your buddy's name if the instructor still requires it. The enabled buddy field must be filled in.

With this option enabled, a single write sends `your name & buddy name`. Check the complete UTF-8 text and byte count before sending. No newline is appended. The assignment does not specify a delimiter; ask the instructor if the firmware expects another format.

## Build an Android APK

This is source code, not an APK. Use Node.js 22.x, an Expo account and a physical Android phone. Extract the ZIP and open the `BLUEPRINT` folder containing `package.json`.

```bash
npm ci
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build -p android --profile preview
```

Choose Android. For a new project, allow creation of the Expo project and Android keystore. For an existing project, preserve its project ID and credentials.

The `preview` profile produces an installable APK. When the build finishes, open the build link on your phone, download the APK and install it. Allow installation from that source if Android asks. This APK includes the JavaScript bundle; it does not need Metro running during class.

EAS queue times and plan limits depend on your account. No account was used and no APK was built while preparing this package. See `UPDATE_EXISTING.md` to update an already configured project. This edition adds expo-font, so copying only App.tsx is insufficient.

### Local development

With Android Studio, the required Android SDK/JDK and a USB-connected physical phone with USB debugging:

```bash
npm ci
npx expo run:android --device
```

For later JavaScript-only changes to an installed development build:

```bash
npx expo start --dev-client
```

Expo Go cannot use this BLE module. An iOS configuration is provided, but Apple signing setup is required and iOS was not built or tested here.

## In-class screenshots

1. Open the installed app in live mode, with no yellow DEMO banner.
2. Enable Bluetooth, tap **Scan devices**, allow permissions and select the instructor's device.
3. After UUID verification, tap **Open experiment > Read initial value**. Capture screenshot 01 showing the initial response.
4. Tap **Next: write my name**, review your name and the buddy option, then tap **Write value**. Capture screenshot 02 showing the sent value and successful status.
5. Tap **Next: reveal the result > Read & reveal result**. Capture screenshot 03 showing the response.
6. If it still shows your name or a waiting message, wait briefly and tap **Read result again**.
7. **Record** shows all three values, timestamps, device ID and UUIDs. Capture it as extra evidence or use **Share record as text**.
8. Submit real screenshots manually in the assigned Google Classroom task. Save evidence before pressing **Disconnect device** on Connect.

Three screenshots are suggested to demonstrate the three required operations; the prompt does not specify an exact count. Follow separate deadlines and instructions posted in Classroom.

## Preview and demo

Open `BLUEPRINT_English_Y2K_Preview.html` in a browser and select **Try demo mode**. This standalone preview cannot connect to the real device. The native app also provides an explicitly labelled demo for practice. Demo devices and responses are simulated. Never submit demo screenshots as real classroom evidence. Tap **Exit** on the yellow banner to return to live mode.

## BLE implementation

- Android 12+: requests BLUETOOTH_SCAN and BLUETOOTH_CONNECT; uses neverForLocation.
- Android 11 and earlier: requests fine location; Location services must also be enabled.
- iOS: includes an English Bluetooth permission description.
- Stops scanning after 12 seconds, before connecting and during cleanup.
- Checks the exact UUIDs and readable/writable characteristic properties.
- Encodes UTF-8 as Base64 for the library API; decodes Base64 read responses as UTF-8.
- Prefers write-with-response. If only without-response is available, the UI states there is no acknowledgement.
- Requests MTU 185 on Android and checks payload size against negotiated MTU minus 3. Never silently splits or truncates the message.
- Prevents writing before the first read, reading the result before writing, overlapping operations and stale updates after disconnection.
- Session data stays in memory only. Save screenshots before closing, switching modes or disconnecting.
- Notifications are optional and disabled in the PDF example; this app performs the required explicit reads.

## Troubleshooting

| Problem | Action |
| --- | --- |
| No devices | Check Bluetooth/Nearby devices permissions; on older Android enable Location. Move closer and confirm advertising is enabled. |
| UUID check fails | Select the instructor's device and confirm its configuration. |
| Another phone is connected | Ask it to disconnect; the peripheral may support one phone at a time. |
| Payload exceeds MTU | Reconnect or ask the instructor to increase MTU. Do not split writes without knowing the protocol. |
| No grade yet | Wait and read again. The firmware decides the response. |
| Old design or old name | Build the updated source and install the newly generated APK. |
| Expo Go / web Bluetooth error | Use a native build on a physical phone. |

## Files and checks

App.tsx contains the UI and guide. src/ble contains the session state, real native driver and separate demo driver. src/RetroArt.tsx contains original SVG artwork. assets/fonts contains bundled fonts and licenses; no font download is needed at runtime. app.json and eas.json configure native builds. ASSIGNMENT_CHECKLIST.md maps requirements; VALIDATION.md records test limits.

```bash
npm run typecheck
npm test
npx expo install --check
npx expo export --platform android
```

References:
- Instructor attachment: Sample Code of Bluetooth.pdf
- https://github.com/dotintent/react-native-ble-plx
- https://dotintent.github.io/react-native-ble-plx/
- https://docs.expo.dev/build-reference/apk/
- https://docs.expo.dev/develop/development-builds/introduction/
