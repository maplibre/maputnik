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

export function spriteURL(baseUrl: string, extension: ".json" | ".png"): string {
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

export function drawSprite(canvas: HTMLCanvasElement, atlas: HTMLImageElement, sprite: Sprite): void {
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.drawImage(atlas, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, sprite.width, sprite.height);
  if (sprite.sdf) {
    const image = context.getImageData(0, 0, sprite.width, sprite.height);
    decodeSdf(image.data);
    context.putImageData(image, 0, 0);
  }
}
