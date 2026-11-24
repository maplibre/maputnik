import { createContext } from "react";
import type { Sprite } from "../libs/sprites";

export const SpriteCatalogContext = createContext<Sprite[]>([]);
