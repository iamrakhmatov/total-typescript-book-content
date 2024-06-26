---
author: Matt Pocock
pubDatetime: 2024-04-09
modDatetime: 2024-04-09
title: Configuring TypeScript
slug: chapter-14-configuring-typescript

draft: false
tags:
  - config
  - ts-config
  - configuration
description:
  "EXAMPLE POST: My experience about developing my first portfolio website and a blog
  using NextJS and a headless CMS."
chapterNumber: 14
---

We've dipped into TypeScript's `tsconfig.json` configuration file a few times in this book. Let's take a deeper look. We won't cover every option in `tsconfig.json` - many of them are old and rarely used - but we'll cover the most important ones.

## Recommended Configuration

To start, here's a recommended base `tsconfig.json` configuration with options appropriate for most applications you're building:

```json
{
  "compilerOptions": {
    /* Base Options: */
    "skipLibCheck": true,
    "target": "es2022",
    "esModuleInterop": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "strict": true,
    "noUncheckedIndexedAccess": true
}
```

Here's what each setting does:

- `skipLibCheck`: Skips type checking of declaration files, which improves compilation speed. We covered this in the previous chapter.
- `target`: Specifies the ECMAScript target version for the compiled JavaScript code. Targeting `es2022` provides access to some relatively recent JavaScript features - but by the time you read this book, you might want to target a newer version.
- `esModuleInterop`: Enables better compatibility between CommonJS and ES modules.
- `allowJs`: Allows JavaScript files to be imported into the TypeScript project.
- `resolveJsonModule`: Allows JSON files to be imported into your TypeScript project.
- `moduleDetection`: The `force` option tells TypeScript to treat all `.ts` files as a module, instead of a script. We covered this in the previous chapter.
- `isolatedModules`: Ensures that each file can be independently transpiled without relying on information from other files.
- `strict`: Enables a set of strict type checking options that catch more errors and generally promote better code quality.
- `noUncheckedIndexedAccess`: Enforces stricter type checking for indexed access operations, catching potential runtime errors.

Once these base options are set, there are several more to add depending on the type of project you're working on.

### Additional Configuration Options

After setting the base `tsconfig.json` settings, there are several questions to ask yourself to determine which additional options to include.

**Are you transpiling your code with TypeScript?**
If yes, set `module` to `NodeNext`.

**Are you building for a library?**
If you're building for a library, set `declaration` to `true`. If you're building for a library in a monorepo, set `composite` to `true` and `declarationMap` to `true`.

**Are you not transpiling with TypeScript?**
If you're using a different tool to transpile your code, such as ESbuild or Babel, set `module` to `Preserve`, and `noEmit` to `true`.

**Does your code run in the DOM?**
If yes, set `lib` to `["dom", "dom.iterable", "es2022"]`. If not, set it to `["es2022"]`.

### The Complete Base Configuration

Based on your answers to the above questions, here's how the complete `tsconfig.json` file would look:

```json
{
  "compilerOptions": {
    /* Base Options: */
    "skipLibCheck": true,
    "target": "es2022",
    "esModuleInterop": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,

    /* If transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* AND if you're building for a library: */
    "declaration": true,

    /* AND if you're building for a library in a monorepo: */
    "composite": true,
    "declarationMap": true,

    /* If NOT transpiling with TypeScript: */
    "module": "Preserve",
    "noEmit": true,

    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* If your code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}
```

Now that we understand the lay of the land, let's take a look at each of these options in more detail.

## Base Options

### `target`

The `target` option specifies the ECMAScript version that TypeScript should target when generating JavaScript code.

For example, setting `target` to `ES5` will attempt to transform your code to be compatible with ECMAScript 5.

Language features like optional chaining and nullish coalescing, which were introduced later than ES5, are still available:

```tsx
// Optional chaining
const search = input?.search;

// Nullish coalescing
const defaultedSearch = search ?? "Hello";
```

But when they are turned into JavaScript, they'll be transformed into code that works in ES5 environments:

```javascript
// Optional chaining
var search = input === null || input === void 0 ? void 0 : input.search;
// Nullish coalescing
var defaultedSearch = search !== null && search !== void 0 ? search : "Hello";
```

#### `target` Doesn't Polyfill

While `target` can transpile newer syntaxes into older environments, it won't do the same with API's that don't exist in the target environment.

For example, if you're targeting a version of JavaScript that doesn't support `.replaceAll` on strings, TypeScript won't polyfill it for you:

```tsx
const str = "Hello, world!";

str.replaceAll("Hello,", "Goodbye, cruel");
```

This code will error in your target environment, because `target` won't transform it for you. If you need to support older environments, you'll need to find your own polyfills. You configure the environment your code executes in with `lib`, as we saw in a previous chapter.

If you're not sure what to specify for `target`, keep it up to date with the version you have specified in `lib`.

### `esModuleInterop`

`esModuleInterop` is an old flag, released in 2018. It helps with interoperability between CommonJS and ES modules. At the time, TypeScript had deviated slightly from commonly-used tools like Babel in how it handled wildcard imports and default exports. `esModuleInterop` brought TypeScript in line with these tools.

You can read the [release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#support-for-import-d-from-cjs-from-commonjs-modules-with---esmoduleinterop) for more details. Suffice to say, when you're building an application, `esModuleInterop` should always be turned on. There's even a proposal to make it the default in TypeScript 6.0.

### `isolatedModules`

`isolatedModules` prevents some TypeScript language features that single-file transpilers can't handle.

Sometimes you'll be using other tools than `tsc` to turn your TypeScript into JavaScript. These tools, like `esbuild`, `babel` or `swc`, can't handle all TypeScript features. `isolatedModules` disables these features, making it easier to use these tools.

Consider this example of an `AlbumFormat` enum that has been created with `declare const`:

```tsx
declare const enum AlbumFormat {
  CD,
  Vinyl,
  Digital,
}

const largestPhysicalSize = AlbumFormat.Vinyl; // red squiggly line under AlbumFormat when isolatedModules is enabled
```

Recall that the `declare` keyword will place `const enum` in an ambient context, which means that it would be erased at runtime.

When `isolatedModules` is disabled, this code will compile without any errors.

However, when `isolatedModules` is enabled, the `AlbumFormat` enum will not be erased and TypeScript will raise an error:

```tsx
// hovering over AlbumFormat.Vinyl shows:
Cannot access ambient const enums when 'isolatedModules' is enabled.

// index.js after transpilation
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const largestPhysicalSize = AlbumFormat.Vinyl;
```

This is because only `tsc` has enough context to understand what value `AlbumFormat.Vinyl` should have. TypeScript checks your entire project at once, and stores the values for `AlbumFormat` in memory.

When using a single-file transpiler like `esbuild`, it doesn't have this context, so it can't know what `AlbumFormat.Vinyl` should be. So, `isolatedModules` is a way to make sure you're not using TypeScript features that can be difficult to transpile.

`isolatedModules` is a sensible default because it makes your code more portable if you ever need to switch to a different transpiler. It disables so few patterns that it's worth always turning on.

## Strictness

### `strict`

The `strict` option in `tsconfig.json` acts as shorthand for enabling several different type checking options all at once, including catching potential `null` or `undefined` issues and stronger checks for function parameters, among others.

Setting `strict` to `false` makes TypeScript behave in ways which are much less safe. Without `strict`, TypeScript will allow you to assign `null` to a variable that is supposed to be a string:

```tsx
let name: string = null; // no error
```

With `strict` enabled, TypeScript will, of course, catch this error.

In fact, I've written this entire book on the premise that you have `strict` enabled in your codebase. It's the baseline for all modern TypeScript apps.

#### Should You Start With `strict: false`?

One argument you often hear for turning `strict` off is that it's a good on-ramp for beginners. You can get a project up and running faster without having to worry about all the strictness rules.

However, I don't think this is a good idea. A lot of prominent TypeScript libraries, like `zod`, `trpc`, `@redux/toolkit` and `xstate`, won't behave how you expect when `strict` is off. Most community resources, like StackOverflow and React TypeScript Cheatsheet, assume you have `strict` enabled.

Not only that, but a project that starts with `strict: false` is likely to stay that way. On a mature codebase, it can be very time-consuming to turn `strict` on and fix all of the errors.

So, I consider `strict: false` a fork of TypeScript. It means you can't work with many libraries, makes seeking help harder, and leads to more runtime errors.

### `noUncheckedIndexedAccess`

One strictness rule which isn't part of `strict` is `noUncheckedIndexedAccess`. When enabled, it helps catch potential runtime errors by detecting cases where accessing an array or object index might return `undefined`.

Consider this example of a `VinylSingle` interface with an array of `tracks`:

```typescript
interface VinylSingle {
  title: string;
  artist: string;
  tracks: string[];
}

const egoMirror: VinylSingle = {
  title: "Ego / Mirror",
  artist: "Burial / Four Tet / Thom Yorke",
  tracks: ["Ego", "Mirror"],
};
```

To accessing the b-side of `egoMirror`, we would index into its `tracks` like this:

```typescript
const bSide = egoMirror.tracks[1];
console.log(bSide.toUpperCase()); // 'MIRROR'
```

Without `noUncheckedIndexedAccess` enabled in `tsconfig.json`, TypeScript assumes that indexing will always return a valid value, even if the index is out of bounds.

Trying to access a non-existent fourth track would not raise an error in VS Code, but it does result in a runtime error:

```typescript
const nonExistentTrack = egoMirror.tracks[3];
console.log(nonExistentTrack.toUpperCase()); // no error in VS Code

// However, running the code results in a runtime error:
TypeError: Cannot read property 'toUpperCase' of undefined
```

By setting `noUncheckedIndexedAccess` to `true`, TypeScript will infer the type of every indexed access to be `T | undefined` instead of just `T`. In this case, every entry in `egoMirror.tracks` would be of type `string | undefined`:

```tsx
const ego = egoMirror.tracks[0];
const mirror = egoMirror.tracks[1];
const nonExistentTrack = egoMirror.tracks[3];

// hovering over ego shows:
// const ego: string | undefined
```

However, because the types of each of the tracks are now `string | undefined`, we have errors when attempting to call `toUpperCase` even for the valid tracks:

```typescript
console.log(ego.toUpperCase()); // red squiggly line under ego

// hovering over ego shows
'ego' is possibly 'undefined'
```

This means that we have to handle the possibility of `undefined` values when accessing array or object indices.

So `noUncheckedIndexedAccess` makes TypeScript more strict, but at the cost of having to handle `undefined` values more carefully.

Usually, this is a good trade-off, as it helps catch potential runtime errors early in the development process. But I wouldn't blame you if you end up turning it off in some cases.

### Other Strictness Options

I tend to configure my `tsconfig.json` no stricter than `strict` and `noUncheckedIndexedAccess`. If you want to go further, there are several other strictness options you can enable:

- `allowUnreachableCode`: Errors when unreachable code is detected, like code after a `return` statement.
- `exactOptionalPropertyTypes`: Requires that optional properties are exactly the type they're declared as, instead of allowing `undefined`.
- `noFallthroughCasesInSwitch`: Ensures that any non-empty `case` block in a `switch` statement ends with a `break`, `return`, or `throw` statement.
- `noImplicitOverride`: Requires that `override` is used when overriding a method from a base class.
- `noImplicitReturns`: Ensures that every code path in a function returns a value.
- `noPropertyAccessFromIndexSignature`: Forces you to use `example['access']` when accessing a property on an object with an index signature.
- `noUnusedLocals`: Errors when a local variable is declared but never used.
- `noUnusedParameters`: Errors when a function parameter is declared but never used.

## The Two Choices For `module`

The `module` setting in `tsconfig.json` specifies how TypeScript should treat your imports and exports. There are two main choices: `NodeNext` and `Preserve`.

- When you want to transpile your TypeScript code with the TypeScript compiler, choose `NodeNext`.
- When you're using an external bundler like Webpack or Parcel, choose `Preserve`.

### `NodeNext`

If you are transpiling your TypeScript code using the TypeScript compiler, you should choose `module: "NodeNext"` in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "module": "NodeNext"
  }
}
```

`module: "NodeNext"` also implies `moduleResolution: "NodeNext"`, so I'll discuss their behavior together.

When using `NodeNext`, TypeScript emulates Node's module resolution behavior, which includes support for features like `package.json`'s `"exports"` field. Code emitted using `module: NodeNext` will be able to be run in a Node.js environment without any additional processing.

One thing you'll notice when using `module: NodeNext` is that you'll need to use `.js` extensions when importing TypeScript files:

```typescript
// Importing from album.ts
import { Album } from "./album.js";
```

This can feel strange at first, but it's necessary because TypeScript doesn't transform your imports. This is how the import will look when it's transpiled to JavaScript - and TypeScript prefers for the code you write to match the code you'll run.

#### `Node16`

`NodeNext` is a shorthand for 'the most up-to-date Node.js module behavior'. If you prefer to pin your TypeScript to a specific Node version, you can use `Node16` instead:

```json
{
  "compilerOptions": {
    "module": "Node16"
  }
}
```

At the time of writing, Node.js 16 is now end-of-life, but each Node version after it copied its module resolution behavior. This may change in the future, so it's worth checking the TypeScript documentation for the most up-to-date information - or sticking to `NodeNext`.

### `Preserve`

If you're using a bundler like Webpack, Rollup, or Parcel to transpile your TypeScript code, you should choose `module: "Preserve"` in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "module": "Preserve"
  }
}
```

This implies `moduleResolution: "Bundler"`, which I'll discuss together.

When using `Preserve`, TypeScript assumes that the bundler will handle module resolution. This means that you don't have to include `.js` extensions when importing TypeScript files:

```typescript
// Importing from album.ts
import { Album } from "./album";
```

This is because the bundler will take care of resolving the file paths and extensions for you.

This means that if you're using an external bundler or transpiler, you should use `module: "Preserve"` in your `tsconfig.json` file. This is also true if you're using a frontend framework like Next.js, Remix, Vite, or SvelteKit - it will handle the bundling for you.

## `noEmit`

The `noEmit` option in `tsconfig.json` tells TypeScript not to emit any JavaScript files when transpiling your TypeScript code.

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

This pairs well with `module: "Preserve"` - in both cases, you're telling TypeScript that an external tool will handle the transpilation for you.

TypeScript's default for this option is `false` - so if you're finding that running `tsc` emits JavaScript files when you don't want it to, set `noEmit` to `true`.

## Source Maps

TypeScript can generate source maps which link your compiled JavaScript code back to your original TypeScript code. You can enable them by setting `sourceMap` to `true` in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

When you run your code with Node, you can add the flag `--enable-source-maps`:

```bash
node --enable-source-maps dist/index.js
```

Now, when an error occurs in your compiled JavaScript code, the stack trace will point to the original TypeScript file.

## Transpiling Code for Library Use

A very common way of using TypeScript is to build a library that others can use in their projects. When building a library, there are a few additional settings you should consider in your `tsconfig.json` file.

### `outDir`

The `outDir` option in `tsconfig.json` specifies the directory where TypeScript should output the transpiled JavaScript files.

When building a library, it's common to set `outDir` to a `dist` directory in the root of your project:

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

This can be combined with `rootDir` to specify the root directory of your TypeScript files:

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

Now, a file at `src/index.ts` will be transpiled to `dist/index.js`.

### Creating Declaration Files

We've already discussed how `.d.ts` declaration files are used to provide type information for JavaScript code, but so far we've only created them manually.

By setting `"declaration": true` in your `tsconfig.json` file, TypeScript will automatically generate `.d.ts` files and save them alongside your compiled JavaScript files.

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

For example, consider this `album.ts` file:

```typescript
// inside album.ts

export interface Album {
  title: string;
  artist: string;
  year: number;
}

export function createAlbum(
  title: string,
  artist: string,
  year: number
): Album {
  return { title, artist, year };
}
```

After running the TypeScript compiler with the `declaration` option enabled, it will generate an `album.js` and `album.d.ts` file in the project's `dist` directory.

Here's the declaration file code with the type information:

```typescript
// album.d.ts

export interface Album {
  title: string;
  artist: string;
  year: number;
}

export declare function createAlbum(
  title: string,
  artist: string,
  year: number
): Album;
```

And the `album.js` file transpiled from TypeScript:

```javascript
// album.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbum = void 0;
function createAlbum(title, artist, year) {
  return { title, artist, year };
}
exports.createAlbum = createAlbum;
```

Now, anyone who uses your library will have access to the type information in the `.d.ts` files.

### Declaration Maps

One common use case for libraries is inside monorepos. A monorepo is a collection of libraries, each with their own `package.json`, that can be shared across different applications. This means that you'll often be developing the library and the application that uses it side-by-side.

For example, a monorepo might look like this:

```
monorepo
  ├── apps
  │   └── my-app
  │       └── package.json
  └── packages
      └── my-library
          └── package.json
```

However, if you're working on code inside `my-app` that imports from `my-library`, you'll be working with the compiled JavaScript code, not the TypeScript source code. This means that when you `CMD + click` on an import, you'll be taken to the `.d.ts` file instead of the original TypeScript source.

This is where declaration maps come in. They provide a mapping between the generated `.d.ts` and the original `.ts` source files.

In order to create them, the `declarationMap` setting should be added to your `tsconfig.json` file, as well as the `sourceMap` setting:

```json
{
  "compilerOptions": {
    "declarationMap": true,
    "sourceMap": true
  }
}
```

With this option in place, the TypeScript compiler will generate `.d.ts.map` files alongside the `.d.ts` files. Now, when you `CMD + click` on an import in `my-app`, you'll be taken to the original TypeScript source file in `my-library`.

This is less useful when your library is on `npm`, unless you also ship your source files - but that's a little outside the scope of this book. In a monorepo, however, declaration maps are a great quality-of-life improvement.

## `jsx`

TypeScript has built-in support for transpiling JSX syntax, which is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. In TypeScript, these need to be written in files with a `.tsx` extension:

```tsx
// Component.tsx
const Component = () => {
  return <div />;
};
```

The `jsx` option tells TypeScript how to handle JSX syntax, and has five possible values. The most common are `preserve`, `react`, and `react-jsx`. Here's what each of them does:

- `preserve`: Keeps JSX syntax as-is.
- `react`: Transforms JSX into `React.createElement` calls. Useful for React 16 and earlier.
- `react-jsx`: Transforms JSX into `_jsx` calls, and automatically imports from `react/jsx-runtime`. Useful for React 17 and later.

## Managing Multiple TypeScript Configurations

As projects grow in size and complexity, it's common to have different environments or targets within the same project.

For example, your single repo might include both a client-side application and a server-side API, each with different requirements and configurations.

This means you might want different `tsconfig.json` settings for different parts of your project. In this section, we'll look at how multiple `tsconfig.json` files can be composed together.

### How TypeScript Finds `tsconfig.json`

In a project with multiple `tsconfig.json` files, your IDE will need to know which one to use for each file. It determines which `tsconfig.json` to use by looking for the closest one to the current `.ts` file in question.

For example, given this file structure:

```
project
  ├── client
  │   └── tsconfig.json
  ├── server
  │   └── tsconfig.json
  └── tsconfig.json
```

A file inside the `client` directory will use the `client/tsconfig.json` file, while a file inside the `server` directory will use the `server/tsconfig.json` file. Anything inside the `project` directory that isn't in `client` or `server` will use the `tsconfig.json` file in the root of the project.

This means that `client/tsconfig.json` can contain settings specific to the client-side application, such as adding the `dom` types:

```json
{
  "compilerOptions": {
    // ...other options
    "lib": ["es2022", "dom", "dom.iterable"]
  }
}
```

But `server/tsconfig.json` can contain settings specific to the server-side application, such as removing the `dom` types:

```json
{
  "compilerOptions": {
    // ...other options
    "lib": ["es2022"]
  }
}
```

#### Globals with Multiple `tsconfig.json` Files

A useful feature of having multiple `tsconfig.json` files is that globals are tied to a single configuration file.

For example, say a declaration file `server.d.ts` in the `server` directory has a global declaration for a `ONLY_ON_SERVER` variable. This variable will only be available in files that are part of the `server` configuration:

```tsx
// inside server/server.d.ts
declare const ONLY_ON_SERVER: string;
```

Trying to use `ONLY_ON_SERVER` in a file that's part of the `client` configuration will result in an error:

```tsx
// inside client/index.ts
console.log(ONLY_ON_SERVER); // red squiggly line under ONLY_ON_SERVER
```

This feature is useful when dealing with environment-specific variables or globals that come from testing tools like Jest or Cypress, and avoids polluting the global scope.

### Extending Configurations

When you have multiple `tsconfig.json` files, it's common to have shared settings between them:

```tsx
// client/tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": [
      "es2022",
      "dom",
      "dom.iterable"
    ],
    "jsx": "react-jsx",
  }
}

// server/tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": [
      "es2022"
    ]
  },
}
```

Instead of repeating the same settings in both `client/tsconfig.json` and `server/tsconfig.json`, we can create a new `tsconfig.base.json` file that can be extended from.

The common settings can be moved to `tsconfig.base.json`:

```tsx
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true
  }
}
```

Then, the `client/tsconfig.json` would extend the base configuration wit the `extends` option that points to the `tsconfig.base.json` file:

```tsx
// client/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": [
      "es2022",
      "dom",
      "dom.Iterable"
    ],
    "jsx": "react-jsx"
  }
}
```

The `server/tsconfig.json` would do the same:

```tsx
// server/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": [
      "es2022"
    ]
  }
}
```

This approach is particularly useful for monorepos, where many different `tsconfig.json` files might need to reference the same base configuration.

Any changes to the base configuration will be automatically inherited by the `client` and `server` configurations. However, it's important to note that using `extends` will only copy over `compilerOptions` from the base configuration, and not other settings like `include` or `exclude` (which are used to specify which files to include or exclude from compilation).

```json
{
  "compilerOptions": {}, // Will be inherited by 'extends'
  "include": [], // Will NOT be inherited by 'extends'
  "exclude": [] // Will NOT be inherited by 'extends'
}
```

### `--project`

Now we have a set of `tsconfig.json` files that are organized and share common settings. This works OK in the IDE, which automatically detects which `tsconfig.json` file to use based on the file's location.

But what if we want to run a command that checks the entire project at once?

To do this, we'd need to run `tsc` using the `--project` flag and point it to each `tsconfig.json` file:

```bash
tsc --project ./client/tsconfig.json
tsc --project ./server/tsconfig.json
```

This can work OK for a small amount of configurations, but it can quickly become unwieldy as the number of configurations grows.

### Project References

To simplify this process, TypeScript has a feature called project references. This allows you to specify a list of projects that depend on each other, and TypeScript will build them in the correct order.

You can configure a single `tsconfig.json` file at the root of the project that references the `client` and `server` configurations:

```tsx
// tsconfig.json
{
  "references": [
    {
      "path": "./client/tsconfig.json"
    },
    {
      "path": "./server/tsconfig.json"
    }
  ],
  "files": []
}
```

Note that there is also an empty `files` array in the configuration above. This is to prevent the root `tsconfig.json` from checking any files itself - it just references the other configurations.

Next, we need to add the `composite` option to the `tsconfig.base.json` file. This option tells TypeScript that `client` and `server` are child project configurations that needs to be run with project references:

```tsx
// tsconfig.base.json
{
  "compilerOptions": {
    // ...other options
    "composite": true
  },
}
```

Now, from the root, we can run `tsc` with the `-b` flag to run each of the projects:

```bash
tsc -b
```

The `-b` flag tells TypeScript to run the project references. This will typecheck and build the `client` and `server` configurations in the correct order.

When we run this for the first time, some `.tsbuildinfo` files will be created in the `client` and `server` directories. These files are used by TypeScript to cache information about the project, and speed up subsequent builds.

So, to sum up:

- Project references allow you to run several `tsconfig.json` files in a single `tsc` command.
- Each sub-configuration should have `composite: true` in its `tsconfig.json` file.
- The root `tsconfig.json` file should have a `references` array that points to each sub-configuration, and `files: []` to prevent it from checking any files itself.
- Run `tsc -b` from the root to build all the configurations.
- Each `tsconfig.json` will have its own global scope, and globals will not be shared between configurations.
- `.tsbuildinfo` files will be created in each sub-configuration to speed up subsequent builds.

Project references can be used in all sorts of ways to manage complex TypeScript projects. They're especially useful when you only want globals to affect a certain part of your project, like types from the `dom` or test frameworks which add functions to the global scope.
