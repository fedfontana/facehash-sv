# facehash-sv

> Svelte port of [facehash](https://github.com/facehash/facehash) by cossistant. 
>
> The current version ports the library code as of commit [fce5dc5b65102754798d9d717fe5951d2d45d0c3](https://github.com/cossistantcom/cossistant/tree/fce5dc5b65102754798d9d717fe5951d2d45d0c3/packages/facehash).

Deterministic avatar faces from any string. Zero dependencies, works with Svelte 5 and SvelteKit.

## Installation

```bash
bun install facehash-sv
```

## Quick Start

### Svelte Component

```svelte
<script>
  import { Facehash } from "facehash-sv";
</script>

<Facehash name="john@example.com" />
```

### SvelteKit API Route (Image Generation)

Generate SVG avatar images via API endpoint

```ts
// src/routes/api/avatar/+server.ts
import { toFacehashHandler } from "facehash-sv/sveltekit";

export const GET = toFacehashHandler();
```

Then use it:
```
GET /api/avatar?name=john@example.com
GET /api/avatar?name=john&size=200&variant=solid
```

Returns an SVG image. Cached for 1 year by default.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | String to generate face from |
| `size` | `number \| string` | `40` | Size in pixels or CSS units |
| `colors` | `string[]` | - | Array of hex/hsl colors |
| `colorClasses` | `string[]` | - | Array of Tailwind classes (use instead of `colors`) |
| `variant` | `"gradient" \| "solid"` | `"gradient"` | Background style |
| `intensity3d` | `"none" \| "subtle" \| "medium" \| "dramatic"` | `"dramatic"` | 3D rotation effect |
| `interactive` | `boolean` | `true` | Animate on hover |
| `showInitial` | `boolean` | `true` | Show first letter below face |

## Examples

### Custom Colors

```svelte
<Facehash
  name="alice"
  colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
/>
```

### With Tailwind Classes

```svelte
<Facehash
  name="bob"
  colorClasses={["bg-pink-500", "bg-blue-500", "bg-green-500"]}
  class="rounded-full"
/>
```

### Flat Style (No 3D)

```svelte
<Facehash name="charlie" intensity3d="none" variant="solid" />
```

### Without Initial Letter

```svelte
<Facehash name="diana" showInitial={false} />
```

## Avatar with Image Fallback

For image avatars that fall back to Facehash when the image fails:

```svelte
<script>
  import { Avatar, AvatarImage, AvatarFallback } from "facehash-sv";
</script>

<Avatar style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden;">
  <AvatarImage src="/photo.jpg" alt="User" />
  <AvatarFallback name="john@example.com" />
</Avatar>
```

`AvatarFallback` renders a `Facehash` by default. For initials instead:

```svelte
<AvatarFallback name="John Doe" facehash={false} />
```

## SvelteKit API Route

The `facehash-sv/sveltekit` export provides a route handler factory for generating avatar images server-side. This is useful for:

- Email avatars (where you need an image URL)
- Open Graph / social sharing images
- Any context where you need a URL instead of a Svelte component

### Basic Setup

```ts
// src/routes/api/avatar/+server.ts
import { toFacehashHandler } from "facehash-sv/sveltekit";

export const GET = toFacehashHandler();
```

### With Custom Defaults

```ts
export const GET = toFacehashHandler({
  size: 200,           // Default image size (default: 400)
  variant: "solid",    // "gradient" | "solid" (default: "gradient")
  showInitial: false,  // Show first letter (default: true)
  colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],  // Custom color palette
  cacheControl: "public, max-age=86400",      // Custom cache header
});
```

### Query Parameters

All options can be overridden via URL query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | **Required.** String to generate avatar from |
| `size` | `number` | Image size in pixels (16-2000) |
| `variant` | `string` | `"gradient"` or `"solid"` |
| `showInitial` | `boolean` | `"true"` or `"false"` |
| `colors` | `string` | Comma-separated hex colors (e.g., `#ff0000,#00ff00`) |

### Example URLs

```
/api/avatar?name=john@example.com
/api/avatar?name=Alice&size=128
/api/avatar?name=Bob&variant=solid&showInitial=false
/api/avatar?name=Team&colors=%23ff6b6b,%234ecdc4,%2345b7d1
```

### Caching

By default, responses include `Cache-Control: public, max-age=31536000, immutable` (1 year). Same name always generates the same image, so aggressive caching is safe.

## Exports

```ts
// Main component
import { Facehash } from "facehash-sv";

// Avatar compound components
import { Avatar, AvatarImage, AvatarFallback } from "facehash-sv";

// Individual face components
import { RoundFace, CrossFace, LineFace, CurvedFace, FACES } from "facehash-sv";

// Core utilities
import { stringHash, computeFacehash, getColor, DEFAULT_COLORS } from "facehash-sv";

// Types
import type { FacehashProps, Variant, Intensity3D } from "facehash-sv";
import type { AvatarContextValue, ImageLoadingStatus } from "facehash-sv";

// SvelteKit route handler
import { toFacehashHandler } from "facehash-sv/sveltekit";
import type { FacehashHandlerOptions } from "facehash-sv/sveltekit";
```