"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { swapLocalePath, type Locale } from "@/lib/i18n";

/** 语言切换（保留路径）；静态导出下 usePathname 在客户端可用，SSR 回退首页。 */
export function LangSwitch({ to, hrefLang, label }: { to: Locale; hrefLang: string; label: string }) {
  const pathname = usePathname() ?? `/${to}/`;
  return (
    <Link className="lang-switch" href={swapLocalePath(pathname, to)} hrefLang={hrefLang} lang={hrefLang} prefetch={false}>
      {label}
    </Link>
  );
}

/** 移动菜单：真按钮 + aria-expanded/controls + Esc/点外部关闭 + 焦点入第一项（与 chrome-v2 同行为）。 */
export function ChromeMenu({ label, menuLabel, children }: { label: string; menuLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const panel = root.current?.querySelector<HTMLElement>(".chrome-menu-panel");
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  return (
    <div className="chrome-menu" ref={root}>
      <button
        ref={button}
        type="button"
        className="chrome-menu-button"
        aria-expanded={open}
        aria-controls="chrome-menu-panel"
        aria-label={`${label}：${menuLabel}`}
        onClick={() => setOpen((x) => !x)}
      >
        <span aria-hidden="true">☰</span>
        <span className="chrome-menu-text">{menuLabel}</span>
      </button>
      {open ? (
        <div
          className="chrome-menu-panel"
          id="chrome-menu-panel"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
