# BLUEPRINT 2.0 validation

## Completed checks

- TypeScript: `npm run typecheck` passed.
- Dependency alignment: `npx expo install --check` passed.
- Nine session tests passed: exact UUIDs; exact solo payload and read/write/read order; step guards; failed-write state reset; unchanged raw and empty responses; disconnect invalidation; overlap guard; whitespace validation; optional buddy encoded as one text value.
- Web export succeeded with three bundled font assets.
- Android JavaScript/Hermes export succeeded; Android native prebuild succeeded with the BLE and expo-font plugins.
- Standalone HTML preview tested in Chromium: demo scan/connect, initial read, solo write, result read, record, optional buddy write, disconnect, demo exit and the live-mode web explanation.
- No browser page errors in the tested flow.
- English classroom guide and error messages inspected.
- Bundled font loading verified. Phone-width layouts reviewed at 390 px and 320 px; no document-level horizontal overflow at 320 px.
- Source, documentation and generated preview audited for Thai characters and the removed buddy identity; no matches.
- The release archive excludes native build folders, dependencies, earlier previews and old documentation.

## Limits

No Gradle APK build, EAS cloud build, iOS build or radio-level BLE test was performed. The instructor's physical device is unavailable in this environment. Native permissions, negotiated MTU, firmware timing and the real grade response must be checked on a physical phone in class.

The HTML preview and explicitly labelled demo mode use simulated data. Their screenshots cannot be used as evidence of a real Bluetooth transaction. Live mode reads the response from the instructor's device and does not invent a grade.
