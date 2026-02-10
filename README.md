# React Native Chat Application

A mobile chat application built with React Native and Expo.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for testing on physical devices)

## Installation

Install dependencies:

```bash
npm install
```

## Running the App

### Start the development server

```bash
npx expo start
```

### Run on iOS Simulator

```bash
npx expo start --ios
```

### Run on Android Emulator

```bash
npx expo start --android
```

### Run on Physical Device

1. Install the Expo Go app from the App Store or Google Play
2. Start the development server: `npx expo start`
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

## Project Structure

```
.
├── app/                  # Application screens and routing
│   └── index.tsx        # Main chat screen
├── components/          # Reusable UI components
├── assets/             # Images, fonts, and other static files
├── constants/          # App-wide constants and configuration
├── hooks/              # Custom React hooks
└── utils/              # Utility functions and helpers
```
