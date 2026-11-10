/** 极简 Markdown→HTML（只覆盖法务源实际用到的语法；不引第三方依赖）。 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(s: string): string {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  return t;
}

export function mdToHtml(md: string): string {
  const out: string[] = [];
  let list: string[] = [];
  let para: string[] = [];
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`);
      list = [];
    }
  };
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushList(); flushPara(); continue; }
    if (/^-{3,}$/.test(line)) { flushList(); flushPara(); out.push("<hr />"); continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { flushList(); flushPara(); const n = h[1].length; out.push(`<h${n}>${inline(h[2])}</h${n}>`); continue; }
    if (/^[-*]\s+/.test(line)) { flushPara(); list.push(line.replace(/^[-*]\s+/, "")); continue; }
    if (/^>\s?/.test(line)) { flushList(); flushPara(); out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();
  return out.join("\n");
}
