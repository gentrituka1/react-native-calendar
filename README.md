# Quipendar

Custom calendar app (**Quipendar**) for the ProCredit React Native take-home: email auth, biometric re-entry, a Google Calendar-style month/day board built without a calendar library, and create/edit meetings.

The default data source is **Async Storage** so a reviewer can clone and run without cloud credentials. Firebase Auth + Firestore is implemented behind the same repository contracts and can be switched on with one config flag.

## Software versions

| Tool | Version used to build this project |
| --- | --- |
| Node.js | **22.13+** (React Native 0.87 requires this; `engines` is set accordingly) |
| npm | 11.x |
| React Native CLI | `@react-native-community/cli` 20.2.0 |
| React Native | **0.87.1** (bare workflow, **not Expo**) |
| React | 19.2.3 |
| TypeScript | 6.x |
| JDK | 17 or 21 (Temurin 21 was used locally) |
| Android SDK | compileSdk 37, minSdk 24, targetSdk 36 |
| Xcode / CocoaPods | latest stable (iOS only) |
| Gradle / AGP | versions shipped with RN 0.87.1 |
| Kotlin | 2.2.0 |

JavaScript dependencies are pinned in `package.json` / `package-lock.json`. Important libraries:

- `@react-navigation/native` + native stack + bottom tabs
- `react-native-safe-area-context` (notches / home indicator)
- `react-native-screens` (native screen transitions)
- `@react-native-async-storage/async-storage`
- `react-native-biometrics` + `react-native-keychain`
- `firebase` (JS SDK, Auth + Firestore)
- Jest + `@testing-library/react-native`

## Run the app

```sh
git clone <your-repo-url> react-native-calendar
cd react-native-calendar
npm install
```

### Android

1. Start an emulator or plug in a device (`adb devices` should list it).
2. From the project root:

```sh
npm start
npm run android
```

`npm run android` on Windows maps a short `R:` drive before Gradle runs. That avoids Ninja failing with `Filename longer than 260 characters` when the repo lives under a long Desktop path.

### iOS (macOS only)

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

### First login

1. Open **Sign up**.
2. Email + password (min 8 characters, at least one letter and one number).
3. After a successful sign-in or sign-up the app stores credentials in the Keychain / Keystore.
4. **Sign out** from Profile. On the next Sign in screen, **Sign in with Biometrics** appears if the device has Face ID / fingerprint.

## Architecture

This is not a pile of screens. The layout is a small **feature-sliced** app with a **composition root**.

```
src/
  app/                 # providers, navigation, app shell
  config/              # data-source switch, Firebase keys
  core/                # contracts, shared types, errors
  features/
    auth/
    calendar/
    events/
    profile/
  infrastructure/      # Firebase + Async Storage + biometrics
  shared/              # theme + reusable UI
```

### Why this shape

Reviewers (and you, in the interview) should be able to answer “where does a new meeting live?” without hunting through a `components/` dump.

- **`core/contracts`** define `AuthRepository`, `EventRepository`, `BiometricsService`, `KeyValueStore`. Screens never import Async Storage or Firebase.
- **`infrastructure/createContainer.ts`** is the only place that picks an implementation. That is the composition root.
- **`features/*`** own their screens, presentational components, validation, and **pure domain**. Calendar math does not live in a `.tsx` file.
- **`shared/ui`** is a tiny design system (`Screen`, `AppButton`, `AppTextField`, `AppHeader`, tab bar). The calendar widget is *not* in here on purpose: it is a product feature, not a generic atom.

### Data source

`src/config/appConfig.ts`:

```ts
dataSource: 'local' | 'firebase'
```

| Mode | Auth | Events | Token |
| --- | --- | --- | --- |
| `local` (default) | Async Storage user list | Async Storage per owner | Mimic token `local.<payload>` with TTL |
| `firebase` | Firebase Auth email/password | Firestore `users/{uid}/events` | Real Firebase ID token |

To use Firebase:

1. Create a Firebase project, enable **Email/Password** auth and **Firestore**.
2. Paste the web app config into `src/config/firebaseConfig.ts`.
3. Set `appConfig.dataSource` to `'firebase'`.
4. Suggested Firestore rules (owner-only):

```
match /users/{userId}/events/{eventId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

If the flag is `firebase` but the keys are still empty, the container falls back to local storage so the app does not boot into a hard crash.

### Auth and biometrics

1. Sign up / sign in validates email + password in a **pure** module (`authValidation.ts`), then calls the repository.
2. On success, email + password are written to the Keychain (not Async Storage).
3. Session restore uses the mimic token (local) or `onAuthStateChanged` (Firebase).
4. Sign out clears the in-app session. Keychain credentials stay so “Sign in with Biometrics” still works for a previously logged-in user.
5. Biometric prompt is an OS challenge; only after success does the app reuse the stored secret to sign in again.

Passwords in the local adapter are FNV-1a hashed with an email salt. That is **not** a production KDF. It exists so the local adapter is not storing plaintext. Firebase hashing is the production path.

### Calendar (no third-party calendar widget)

`getMonthMatrix` always returns **6 weeks**, Monday-first (European default, matching a ProCredit-style product). Month cells show up to three color dots. Selecting a day fills the agenda. **Day** view is a 24-hour timeline; overlapping meetings are packed into columns (`layoutDayEvents`).

Create/edit is a modal stack screen that **reuses** `MonthGrid` for the date and a custom time sheet (not a date-picker library).

### Navigation and notches

- Unauthenticated: Auth stack (`slide_from_right`).
- Authenticated: tabs (Calendar, Profile) + modal Event editor (`slide_from_bottom`).
- Custom header + custom tab bar.
- `react-native-safe-area-context` pads status bar, notch, and home indicator. Android `edgeToEdgeEnabled` is on.

## Tests

```sh
npm test
npm run test:coverage
```

Coverage gate is **5%** as required. The current suite reports about **42%** statements because calendar math, validation, mimic tokens, and both local repositories are framework-free and injected with an in-memory store.

What is covered on purpose:

- Auth validation and mimic token expiry
- Month matrix, date math, overlapping-event layout
- Event draft validation
- Local auth and event repositories (duplicate email, TTL, owner isolation)
- Firebase error mapping
- `useCalendarController` view switching
- `AppButton` press / disabled

Native modules (Keychain, biometrics, Firebase client) are mocked at the Jest boundary. Testing those would be device tests, not unit tests.

## Screenshots

Current captures from the iPhone 17 Pro simulator live in `docs/screenshots/`:

- `01-sign-in.png`
- `02-sign-up.png`
- `03-calendar-month.png`
- `04-calendar-day.png`
- `05-event-editor.png`
- `06-profile.png`

## Decisions worth defending in the interview

1. **Repositories over screens talking to Firebase.** Lets you unit-test storage and swap backends without touching UI.
2. **Custom calendar domain.** The assignment forbids a third-party calendar. Putting the grid algorithm in pure TypeScript makes it testable and reusable (month view and the editor date picker share it).
3. **No Reanimated / Gesture Handler.** Screen transitions come from `native-stack` + `react-native-screens`. Extra native gesture libraries add New Architecture CMake paths that break Windows builds (Ninja 260-character limit) without helping the assignment.
4. **Local default, Firebase complete.** A reviewer should not need your cloud project. Shipping both behind one flag is more honest than a half-wired Firebase app.
5. **Feature folders, not type folders.** Auth, calendar, events, and profile can grow independently.

## License

Private assessment submission. Not for redistribution outside the hiring process.
