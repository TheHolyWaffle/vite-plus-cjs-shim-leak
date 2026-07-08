# vite-plus CJS shim leak repro

Minimal reproduction: with `pack.shims: true` **and** `pack.unbundle: true`, the
generated CommonJS output (`dist/index.cjs`) contains bare ESM statements at the top
of the file, so `require()`-ing it throws `SyntaxError: Cannot use import statement
outside a module` at module load.

## Steps

```sh
npm install
npm run build      # vp pack — succeeds (exit 0), no warning

npm run repro      # node -e "require('./dist/index.cjs')"
# -> SyntaxError: Cannot use import statement outside a module
```

The ESM build is fine:

```sh
node --input-type=module -e "import('./dist/index.mjs').then(m => console.log(m.under('/tmp')))"
# -> /tmp/sub
```

## What you get

`dist/index.cjs` (note lines 1-3 — invalid in CommonJS):

```js
import "node:path";
import "node:url";
import.meta.url;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let node_path = require("node:path");
//#region src/index.ts
function under(dir) {
	return (0, node_path.resolve)(dir, "sub");
}
//#endregion
exports.under = under;
```

## Trigger

The bug requires **both** `shims: true` and `unbundle: true` (see `vite.config.ts`).
Removing `unbundle: true` (keeping `shims: true`) produces valid CommonJS
(`let node_path = require("node:path")`, no leading `import`), which loads fine.

## Environment

```
vite-plus  0.2.3
rolldown   1.1.4
tsdown     0.22.3
node       24.16.0
```
