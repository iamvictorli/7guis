# 7GUIs

Welcome to **7GUIs**, an exploration of building the classic [7GUIs](https://eugenkiss.github.io/7guis/) tasks using **Redux** as the primary data layer and **React** (with React Native) as the view layer—fully embracing the concept of “[UI as an afterthought](https://michel.codes/blogs/ui-as-an-afterthought)” by prioritizing domain logic first and letting the UI layer “subscribe” to that logic.

---

## 1. Summary of Project 📖

1.  **7GUIs Overview**
    The 7GUIs tasks—**Counter**, **Temperature Converter**, **Flight Booker**, **Timer**, **CRUD**, **Circle Drawer**, and **Cells**—provide a solid baseline for comparing GUI frameworks. Our approach:

    - Builds robust business logic in Redux (the data layer).
    - Reduces UI-specific logic in React/React Native.
    - Ensures a clear separation of concerns—**Redux** for state, **React/React Native** for rendering.

2.  **Philosophy: ‘UI as an Afterthought’**

    - Inspired by [Michel Weststrate’s blog post](https://michel.codes/blogs/ui-as-an-afterthought), we first create all necessary domain logic and Redux slices in **`packages/state`**.
    - Only afterward do we assemble the **React** and **React Native** view layers, hooking them into the already-functional Redux data.
    - This results in a single source of truth for app logic across multiple platforms.

3.  **Monorepo Structure**
    The project is organized as a pnpm monorepo:

    - **`apps/`**: Contains the platform-specific applications (the view layers).
      - **`web/`**: The React + Vite web client implementing the 7GUIs tasks in the browser. Uses Radix UI for components.
      - **`mobile/`**: An Expo-based React Native client, showcasing the same data logic powering a mobile interface. Uses components from `packages/ui-mobile`.
    - **`packages/`**: Contains shared code, logic, and configuration.
      - **`state/`**: The core Redux Toolkit slices (domain logic) for all 7 tasks. Designed to be UI-agnostic.
      - **`ui-mobile/`**: Reusable React Native UI components specifically built for the mobile app.
      - **`tsconfig/`**: Shared TypeScript configurations used across the monorepo.
    - **Root**: Contains shared configuration files (`eslint.config.js`, `package.json`, `pnpm-workspace.yaml`, `vitest.workspace.ts`, etc.) and scripts to manage the monorepo.

---

## 2. How to Use 🤓

### 2.1 Installation & Setup

Clone the repository and install dependencies using pnpm:

```bash
git clone https://github.com/iamvictorli/7guis.git
cd 7guis
pnpm install
```

### 2.2 Build the State Layer

Before running any UI, make sure the **state** package is built or actively compiled. You can do this in watch mode:

```bash
pnpm dev:state
```

This ensures that the shared Redux logic is properly compiled and ready for web or mobile consumers. (You may leave this running in a separate terminal for active development.)

### 2.3 Running the Web App

Starts the Vite development server for the web application.

```bash
pnpm dev:web
```

- Opens at `http://localhost:5173`.
- Navigate to any of the 7 tasks via the homepage links.

### 2.4 Build the Mobile UI Library

Before running the mobile app, make sure the **ui-moile** package is built or actively compiled. You can do this in watch mode:

```bash
pnpm dev:ui-mobile
```

### 2.5 Running the Mobile App (Expo)

```bash
pnpm dev:mobile
```

- Launches the Expo dev server for React Native.
- Scan the QR code for Expo go or run in an emulator.

### 2.6 Testing

```bash
pnpm test
```

- Uses **Vitest** + **React Testing Library** for thorough coverage.
- Business logic slices are in `packages/state`; UI tests are in `apps/web/app/components/guis`.

### 2.5 Production Builds

- **Web**: `pnpm -F web build` (outputs to `apps/web/build`)
- **Preview**: `pnpm -F web preview`

---

## 3. Tech Info ⚙️

1. **Redux as Data Layer**

   - The **Redux Toolkit** slices in `packages/state` hold all domain logic.
   - Each 7GUIs task has its own slice for clarity.
   - Minimal UI logic: Components purely dispatch actions and select slices.

2. **React & React Native as View Layers**

   - React (web) or React Native (mobile) observes the Redux store.
   - This “UI as an afterthought” approach cuts down on duplication and potential for logic errors—multiple platforms, one consistent state layer.

3. **Modern Tooling**

   - **Vite** for bundling the web client.
   - **Expo** for the mobile client.
   - **Tailwind CSS** and **Radix UI** for accessible and declarative styling.
   - **Vitest** for fast, modern testing.

4. **Folder Layout**

   - `apps/web` → web UI (React)
   - `apps/mobile` → mobile UI (React Native)
   - `packages/state` → Redux slices, actions, and selectors for each GUI.
   - `packages/ui-mobile` → Shared React Native UI components
   - `packages/tsconfig` → Shared TS config

5. **Extend & Scale**
   - Adding more tasks or deeper functionalities is straightforward—add or extend Redux slices, then surface them in the UI.
   - The domain logic remains consistent, tested, and platform-agnostic.

---

## Further Reading

For lessons learned while building these 7GUIs, check out [**my blog article**](https://iamvictorli.com/blog/7guis). It covers architectural decisions, detailed code insights, and more.
