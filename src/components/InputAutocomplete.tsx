import React from "react";
import classnames from "classnames";
import { createPortal } from "react-dom";
import { useCombobox } from "downshift";

import type { SpriteIconPosition } from "../libs/metadata";

const MAX_HEIGHT = 140;
const PREVIEW_MAX = 88;
const PREVIEW_MARGIN = 6;

function loadSpriteSheetUrl(baseUrl: string): Promise<{ url: string; width: number; height: number }> {
  const candidates = [`${baseUrl}.png`, `${baseUrl}@2x.png`];
  return new Promise((resolve, reject) => {
    let i = 0;
    function tryNext() {
      if (i >= candidates.length) {
        reject(new Error("No sprite sheet"));
        return;
      }
      const url = candidates[i++];
      const img = new Image();
      img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = tryNext;
      img.src = url;
    }
    tryNext();
  });
}

function isValidSpriteRect(r: SpriteIconPosition | undefined): r is SpriteIconPosition {
  return (
    !!r &&
    typeof r.width === "number" &&
    typeof r.height === "number" &&
    typeof r.x === "number" &&
    typeof r.y === "number" &&
    r.width > 0 &&
    r.height > 0
  );
}

export type InputAutocompleteProps = {
  value?: string
  options?: any[]
  onChange?(value: string | undefined): unknown
  "aria-label"?: string
  spriteBaseUrl?: string
  spritePositions?: Record<string, SpriteIconPosition>
};

type PreviewPointer = {
  iconId: string
  clientX: number
  clientY: number
};

export default function InputAutocomplete({
  value,
  options = [],
  onChange = () => {},
  "aria-label": ariaLabel,
  spriteBaseUrl,
  spritePositions,
}: InputAutocompleteProps) {
  const [input, setInput] = React.useState(value || "");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = React.useState(MAX_HEIGHT);
  const [spriteSheet, setSpriteSheet] = React.useState<{ url: string; width: number; height: number } | null>(null);
  const [previewPointer, setPreviewPointer] = React.useState<PreviewPointer | null>(null);

  const filteredItems = React.useMemo(() => {
    const lv = input.toLowerCase();
    return options.filter((item) => item[0].toLowerCase().includes(lv));
  }, [options, input]);

  const calcMaxHeight = React.useCallback(() => {
    if (menuRef.current) {
      const space = window.innerHeight - menuRef.current.getBoundingClientRect().top;
      setMaxHeight(Math.min(space, MAX_HEIGHT));
    }
  }, []);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    openMenu,
  } = useCombobox({
    items: filteredItems,
    inputValue: input,
    itemToString: (item) => (item ? item[0] : ""),
    stateReducer: (_state, action) => {
      if (action.type === useCombobox.stateChangeTypes.InputClick) {
        return { ...action.changes, isOpen: true };
      }
      return action.changes;
    },
    onSelectedItemChange: ({ selectedItem }) => {
      const v = selectedItem ? selectedItem[0] : "";
      setInput(v);
      onChange(selectedItem ? selectedItem[0] : undefined);
    },
    onInputValueChange: ({ inputValue: v }) => {
      if (typeof v === "string") {
        setInput(v);
        onChange(v === "" ? undefined : v);
        openMenu();
      }
    },
  });

  React.useEffect(() => {
    if (!spriteBaseUrl) {
      setSpriteSheet(null);
      return;
    }
    let cancelled = false;
    loadSpriteSheetUrl(spriteBaseUrl).then(
      (dim) => {
        if (!cancelled) {
          setSpriteSheet(dim);
        }
      },
      () => {
        if (!cancelled) {
          setSpriteSheet(null);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [spriteBaseUrl]);

  React.useEffect(() => {
    if (!isOpen) {
      setPreviewPointer(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      calcMaxHeight();
    }
  }, [isOpen, calcMaxHeight]);

  React.useEffect(() => {
    window.addEventListener("resize", calcMaxHeight);
    return () => window.removeEventListener("resize", calcMaxHeight);
  }, [calcMaxHeight]);

  React.useEffect(() => {
    setInput(value || "");
  }, [value]);

  const previewRect =
    previewPointer && spritePositions
      ? spritePositions[previewPointer.iconId]
      : undefined;

  const previewNode =
    previewPointer && spriteSheet && isValidSpriteRect(previewRect)
      ? (() => {
        const scale = Math.min(1, PREVIEW_MAX / Math.max(previewRect.width, previewRect.height));
        const displayW = Math.max(1, Math.round(previewRect.width * scale));
        const displayH = Math.max(1, Math.round(previewRect.height * scale));
        const bgW = spriteSheet.width * scale;
        const bgH = spriteSheet.height * scale;
        const outerExtra = 12;
        let left = previewPointer.clientX + PREVIEW_MARGIN;
        let top = previewPointer.clientY - displayH - PREVIEW_MARGIN;
        left = Math.max(
          PREVIEW_MARGIN,
          Math.min(left, window.innerWidth - displayW - outerExtra - PREVIEW_MARGIN),
        );
        top = Math.max(
          PREVIEW_MARGIN,
          Math.min(top, window.innerHeight - displayH - outerExtra - PREVIEW_MARGIN),
        );
        return createPortal(
          <div className="maputnik-sprite-preview" style={{ left, top }} role="presentation">
            <div
              className="maputnik-sprite-preview__inner"
              style={{
                width: displayW,
                height: displayH,
                backgroundImage: `url("${spriteSheet.url}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${bgW}px ${bgH}px`,
                backgroundPosition: `${-previewRect.x * scale}px ${-previewRect.y * scale}px`,
              }}
            />
          </div>,
          document.body,
        );
      })()
      : null;

  return (
    <div className="maputnik-autocomplete">
      <input
        {...getInputProps({
          "aria-label": ariaLabel,
          className: "maputnik-string",
          spellCheck: false,
          onFocus: () => openMenu(),
        })}
      />
      <div
        {...getMenuProps({}, { suppressRefError: true })}
        ref={menuRef}
        style={{ position: "fixed", overflow: "auto", maxHeight, zIndex: 998 }}
        className="maputnik-autocomplete-menu"
      >
        {isOpen &&
          filteredItems.map((item, index) => {
            const iconId = item[0] as string;
            const baseItemProps = getItemProps({
              item,
              index,
              className: classnames("maputnik-autocomplete-menu-item", {
                "maputnik-autocomplete-menu-item-selected": highlightedIndex === index,
              }),
            }) as React.HTMLAttributes<HTMLDivElement>;
            return (
              <div
                key={iconId}
                {...baseItemProps}
                onMouseEnter={(e) => {
                  baseItemProps.onMouseEnter?.(e);
                  if (spriteBaseUrl && spritePositions) {
                    setPreviewPointer({
                      iconId,
                      clientX: e.clientX,
                      clientY: e.clientY,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  baseItemProps.onMouseMove?.(e);
                  setPreviewPointer((p) =>
                    p && p.iconId === iconId
                      ? { iconId, clientX: e.clientX, clientY: e.clientY }
                      : p,
                  );
                }}
                onMouseLeave={(e) => {
                  baseItemProps.onMouseLeave?.(e);
                  setPreviewPointer((p) => (p?.iconId === iconId ? null : p));
                }}
              >
                {item[1]}
              </div>
            );
          })}
      </div>
      {previewNode}
    </div>
  );
}
