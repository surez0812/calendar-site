import type { Shot } from "@/lib/shots";

/** 设备外框（纯 CSS bezel；只加框、不裁不重绘截图）。 */
export function Device({ shots, alt, className = "device--phone", chip, eager = false }: { shots: { light: Shot; dark: Shot }; alt: string; className?: string; chip?: string; eager?: boolean }) {
  return (
    <figure className={`device ${className}`}>
      <div className="device-frame">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet={shots.dark.srcSet} sizes="(max-width: 899px) 240px, 300px" />
          <img src={shots.light.src} srcSet={shots.light.srcSet} sizes="(max-width: 899px) 240px, 300px" width={shots.light.w} height={shots.light.h} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" {...(eager ? { fetchPriority: "high" as const } : {})} />
        </picture>
      </div>
      {chip ? <figcaption className="device-chip">{chip}</figcaption> : null}
    </figure>
  );
}
