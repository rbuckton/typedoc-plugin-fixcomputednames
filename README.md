# typedoc-plugin-fixcomputednames

A plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that fixes the output for some properties with computed names.

This plugin is intended to replace property names like `__@iterator` with `[Symbol.iterator]` and property names like `__computed` with the expression used in the computed property name.

## Installation

```sh
npm install --save-dev typedoc typedoc-plugin-fixcomputednames
```
