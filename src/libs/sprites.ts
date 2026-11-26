import type { SpriteSpecification } from "@maplibre/maplibre-gl-style-spec";

export type Sprite = {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pixelRatio: number;
  sdf?: boolean;
};

export function spriteSources(sprite: SpriteSpecification | undefined) {
  return typeof sprite === "string" ? [{ id: "default", url: sprite }] : sprite || [];
}

export function spriteURL(baseUrl: string, extension: ".json" | ".png" | "@2x.json" | "@2x.png"): string {
  const url = new URL(baseUrl, globalThis.document?.baseURI);
  url.pathname += extension;
  return url.toString();
}

/** Decode the alpha distance field using MapLibre's 0.75 contour and edge smoothing.
 * Previews use a neutral black fill rather than the layer's zoom/data-dependent paint. */
export function decodeSdf(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const t = Math.max(0, Math.min(1, (data[i + 3] / 255 - (0.75 - 0.105)) / (2 * 0.105)));
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = Math.round(t * t * (3 - 2 * t) * 255);
  }
}

export const SPRITE_PREVIEW_SIZE = 36;

export function drawSprite(canvas: HTMLCanvasElement, atlas: HTMLImageElement, sprite: Sprite, size = SPRITE_PREVIEW_SIZE): void {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(size * pixelRatio));
  canvas.height = Math.max(1, Math.round(size * pixelRatio));
  const context = canvas.getContext("2d");
  if (!context) return;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, size, size);
  const scale = Math.min(size / sprite.width, size / sprite.height);
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  const x = (size - width) / 2;
  const y = (size - height) / 2;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(atlas, sprite.x, sprite.y, sprite.width, sprite.height, x, y, width, height);
  if (sprite.sdf) {
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    decodeSdf(image.data);
    context.putImageData(image, 0, 0);
  }
}
