import React from "react";
import classnames from "classnames";
import { useCombobox } from "downshift";
import { SpriteCatalogContext } from "./SpriteCatalogContext";
import { drawSprite, SPRITE_PREVIEW_SIZE, type Sprite } from "../libs/sprites";

function SpritePreview({ sprite, atlas }: { sprite: Sprite; atlas?: HTMLImageElement }) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!canvas.current || !atlas) return;
    try {
      drawSprite(canvas.current, atlas, sprite);
    } catch {
      // A failed/tainted image must not prevent choosing the sprite by name.
      canvas.current.width = 0;
    }
  }, [atlas, sprite]);
  return <span className="maputnik-sprite-preview" aria-hidden="true">
    {atlas && <canvas ref={canvas} data-wd-key={`sprite-preview:${sprite.id}`}
      style={{ width: SPRITE_PREVIEW_SIZE, height: SPRITE_PREVIEW_SIZE }} />}
  </span>;
}

type InputSpriteProps = {
  value?: string;
  onChange?(value: string | undefined): unknown;
  "aria-label"?: string;
  "data-wd-key"?: string;
};

export function InputSprite({ value, onChange = () => {}, "aria-label": ariaLabel, "data-wd-key": testId }: InputSpriteProps) {
  const sprites = React.useContext(SpriteCatalogContext);
  const [input, setInput] = React.useState(value || "");
  const [atlases, setAtlases] = React.useState<Map<string, HTMLImageElement>>(new Map());
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({ maxHeight: 240 });
  const items = React.useMemo(() => sprites.filter(sprite => sprite.id.toLowerCase().includes(input.toLowerCase())), [sprites, input]);

  React.useEffect(() => {
    let cancelled = false;
    setAtlases(new Map());
    const images = [...new Set(sprites.map(sprite => sprite.imageUrl))].map(url => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (!cancelled) setAtlases(previous => new Map(previous).set(url, image));
      };
      image.src = url;
      return image;
    });
    return () => {
      cancelled = true;
      images.forEach(image => { image.onload = null; });
    };
  }, [sprites]);

  React.useEffect(() => { setInput(value || ""); }, [value]);

  const { isOpen, getInputProps, getMenuProps, getItemProps, highlightedIndex, openMenu } = useCombobox({
    items,
    inputValue: input,
    itemToString: item => item?.id || "",
    stateReducer: (_state, action) => action.type === useCombobox.stateChangeTypes.InputClick
      ? { ...action.changes, isOpen: true } : action.changes,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem?.id),
    onInputValueChange: ({ inputValue, type }) => {
      setInput(inputValue || "");
      if (type === useCombobox.stateChangeTypes.InputChange) onChange(inputValue || undefined);
    },
  });

  React.useEffect(() => {
    if (!isOpen) return;
    const resize = () => {
      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const below = window.innerHeight - bounds.bottom - 10;
      const above = bounds.top - 40; // keep the toolbar clear
      const upwards = below < Math.min(240, items.length * 42 + 4) && above > below;
      setMenuStyle({ maxHeight: Math.max(36, Math.min(240, upwards ? above : below)),
        top: upwards ? undefined : "100%", bottom: upwards ? "100%" : undefined });
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, true);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize, true);
    };
  }, [isOpen, items.length]);

  return <div ref={wrapperRef} className="maputnik-autocomplete maputnik-sprite-autocomplete">
    <input {...getInputProps({
      "aria-label": ariaLabel, "data-wd-key": testId,
      className: "maputnik-string", spellCheck: false, onFocus: openMenu,
    })} />
    <div {...getMenuProps()} className="maputnik-autocomplete-menu" style={menuStyle}>
      {isOpen && items.map((sprite, index) => <div key={sprite.id} {...getItemProps({
        item: sprite, index,
        "data-wd-key": `sprite-option:${sprite.id}`,
        className: classnames("maputnik-autocomplete-menu-item maputnik-sprite-option", {
          "maputnik-autocomplete-menu-item-selected": highlightedIndex === index,
        }),
      })}>
        <SpritePreview sprite={sprite} atlas={atlases.get(sprite.imageUrl)} />
        <span className="maputnik-sprite-name">{sprite.id}</span>
      </div>)}
    </div>
  </div>;
}
