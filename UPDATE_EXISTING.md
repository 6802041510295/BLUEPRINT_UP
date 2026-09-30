# Update an existing BLUEPRINT project

Keep your existing project folder, Expo project ID, Android package and signing credentials. Back up that folder first.

1. Extract the new ZIP separately.
2. Copy App.tsx, the entire src and assets folders, package.json, package-lock.json, tsconfig.json, tests and the English documentation into your existing project, replacing matching files.
3. Archive the old README_TH.md and old preview HTML outside the project. Use the new English preview if needed.
4. In your existing app.json, preserve extra.eas.projectId, owner, slug, Android package and iOS bundle identifier. Update:
   - expo.version to 2.0.0.
   - expo.android.versionCode to a number higher than your previous build (at least 2).
   - expo.splash.backgroundColor to #fbf0f9.
   - expo.android.adaptiveIcon.backgroundColor to #f7d1e9.
   - Add "expo-font" to the existing plugins array, keeping react-native-ble-plx and its options.
   - Keep the icon paths pointing to the updated assets.
5. In the existing project, run:

```bash
npm ci
npm run typecheck
npx eas-cli@latest build -p android --profile preview
```

6. Install the APK from this NEW build. Use the existing signing key so it can update your installed app.
7. Verify the pink/lavender windows, the footer BLUEPRINT 2.0 / ENGLISH / Y2K EDITION, one prefilled name and the initially disabled Include a buddy switch.

The expo-font native dependency requires rebuilding the APK. The old APK cannot update itself from a ZIP.

If you maintain tracked native android/ios directories, app.json changes may require native regeneration. Back up custom native changes before following Expo's prebuild workflow. This ZIP uses managed prebuild and does not include native folders.

For a brand-new project, use the complete ZIP and follow README.md.
