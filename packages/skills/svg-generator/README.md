# @h4shed/skill-svg-generator

Generate SVG assets (icons, buttons, patterns, bar charts) from structured prompts. Output is deterministic: identical input always yields byte-identical SVG.

## Installation

```bash
npm install @h4shed/skill-svg-generator
```

## Tool: `generate-svg-asset`

### Input

| Field       | Type   | Required | Notes |
|-------------|--------|----------|-------|
| `objective` | string | yes      | Non-empty, at most 500 characters. Drives asset type, shape, and colors. A `WxH` pattern (e.g. `256x128`) sets dimensions. |
| `context`   | string | no       | Up to 500 characters. Scanned for colors and dimensions. |
| `type`      | enum   | no       | `icon`, `component`, `pattern`, `chart`, `illustration`, `logo`, or `auto` (default). |
| `width`     | number | no       | Finite, 1 to 4096. Overrides any `WxH` in the text. |
| `height`    | number | no       | Finite, 1 to 4096. Overrides any `WxH` in the text. |
| `color`     | string | no       | `#RGB`, `#RRGGBB`, `#RRGGBBAA`, or a named color. |
| `label`     | string | no       | Button label. At most 64 characters, no control characters. |

### Validation rules

- Dimensions must be finite numbers between 1 and 4096. Text-derived `WxH` values are checked the same way.
- Colors must match `#RGB`, `#RRGGBB`, or `#RRGGBBAA`, or be one of: red, blue, green, yellow, orange, purple, pink, cyan, gray, black, white. `#RGB` is expanded and output is uppercase.
- Labels are XML-escaped (`&`, `<`, `>`, `"`, `'`). Colors are never interpolated unless validated.
- Numbers are rounded to two decimals and serialized without float noise.

### Result

Success:

```json
{ "ok": true, "assetType": "icon", "svgCode": "<svg ...>...</svg>", "dimensions": { "width": 64, "height": 64 }, "colorPalette": ["#FFFF44"], "description": "...", "complexity": "simple", "previewText": "..." }
```

Failure (never thrown):

```json
{ "ok": false, "error": "Invalid input: width must be between 1 and 4096", "issues": [{ "path": "width", "message": "must be between 1 and 4096" }] }
```

### Examples

```typescript
{ objective: "Yellow star icon", width: 64, height: 64 }
{ objective: "Green button component", color: "#2e7d32", label: "Save", width: 160, height: 48 }
{ objective: "Blue and green bar chart", width: 200, height: 150 }
{ objective: "Red and yellow geometric pattern", width: 128, height: 128 }
```

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/svg-generator
npm run test --workspace=packages/skills/svg-generator
```

Tests live in `src/__tests__/`. Fixtures in `src/__tests__/fixtures/` pair each `*.input.json` with an `*.expected.svg` (success) or `*.expected.json` (failure). To update a fixture after an intentional rendering change, regenerate it and review the diff.

## License

Apache-2.0
