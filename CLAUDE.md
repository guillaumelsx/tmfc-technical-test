# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native/Expo chat application (mfc-ai-chat) - a technical test for chat UI redesign. Uses Expo 54, React 19, and Tamagui for styling.

## Commands

- `npm start` - Start Expo dev server
- `npm run ios` - Build and run on iOS
- `npm run android` - Build and run on Android
- `npm run web` - Start web version
- `npm run lint` - Lint with ESLint

No test commands are configured.

## Architecture

### Routing & Layout
File-based routing via Expo Router. Root layout (`app/_layout.tsx`) wraps the app with:
- `KeyboardProvider` (react-native-keyboard-controller)
- `TamaguiProvider` (UI framework)
- `GestureHandlerRootView` (gesture support)

Main screen is `app/index.tsx` (chat screen).

### Key Patterns

**Animation**: React Native Reanimated with worklet directives for native thread execution. The `useGradualAnimation` hook tracks keyboard height for smooth input animations.

**Gesture Handling**: Pan gestures on ChatInput trigger expand/collapse/dismiss states. Uses `scheduleOnRN` to bridge worklet context to JS thread.

**Message Grouping**: Messages from the same sender are grouped - avatars/timestamps shown only at group boundaries.

**List Performance**: FlashList instead of FlatList with autoscroll and persistent keyboard taps.

### State Management
Local React state with custom hooks:
- `useChatMessages` - manages message state and calculates display props
- `useGradualAnimation` - keyboard height tracking

No global state library used.

### Styling
Tamagui with a custom color system in `constants/Colors.ts`. Typography components: `Heading5`, `Paragraph1`, `Paragraph3`, `Paragraph3Bold`.

## Directory Structure

```
app/          - Expo Router pages (_layout.tsx, index.tsx)
components/   - UI components (ChatHeader, ChatInput, MessageItem, Avatar, Text)
hooks/        - Custom hooks (useChatMessages, useGradualAnimation)
types/        - TypeScript interfaces (Message, Client, MessageRole enum)
constants/    - Colors, mock data (client.ts, messages.ts)
utils/        - Helpers (haptics, date formatting, user utilities)
assets/icons/ - SVG icon components
```

## Configuration

- **TypeScript**: Strict mode, path alias `@/*` for project root
- **ESLint**: Flat config with expo preset and React Compiler plugin
- **Expo**: New Architecture enabled, React Compiler enabled, typed routes