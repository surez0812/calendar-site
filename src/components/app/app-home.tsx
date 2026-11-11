import { Device } from "@/components/app/device";
import { DevicePlaceholder } from "@/components/app/device-placeholder";
import { PreviewBanner } from "@/components/preview-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE, type Locale } from "@/config/site";
import { copy } from "@/lib/copy";
import { shot, type Shot } from "@/lib/shots";

function pair(id: string): { light: Shot; dark: Shot } | null {
  const light = shot(id, "light");
  const dark = shot(id, "dark");
  return light && dark ? { light, dark } : null;
}

function Feature({ l, n, shots }: { l: Locale; n: 0 | 1 | 2; shots: { light: Shot; dark: Shot } | null }) {
  const c = copy(l);
  const item = c.features.items[n];
  return (
    <section className={`feature${n === 1 ? " feature--flip" : ""}`} data-testid={`feature-${n + 1}`}>
      <div className="feature-in">
        <div className="feature-text">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
        <div className="feature-media">
          {shots ? (
            <Device shots={shots} alt={`${item.title}（${c.hero.chipDesignMock}）`} chip={c.hero.chipDesignMock} />
          ) : (
            <DevicePlaceholder l={l} label={item.title} />
          )}
        </div>
      </div>
    </section>
  );
}

export function AppHome({ l }: { l: Locale }) {
  const c = copy(l);
  const hero = pair("phone-month");
  return (
    <div className="app-home">
      <PreviewBanner l={l} />
      <SiteHeader l={l} />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <p className="kicker"><span className="dot" aria-hidden="true" />{c.hero.kicker}</p>
          <h1 id="hero-title" data-testid="hero-title">{c.hero.title}</h1>
          <p className="hero-sub">{c.hero.sub}</p>
          <div className="cta-row">
            <span className="pill" aria-disabled="true" data-testid="cta-prelaunch">{c.hero.ctaPrimary}</span>
            <a className="text-link" href="#features">{c.hero.ctaSecondary}</a>
          </div>
          <p className="fine">{c.hero.fine}</p>
          <div className="hero-device">
            {hero ? (
              <Device shots={hero} alt={`${c.hero.title} ${c.hero.chipDesignMock}`} className="device--hero" chip={c.hero.chipDesignMock} eager />
            ) : (
              <DevicePlaceholder l={l} label={c.preview.devicePlaceholder} hero />
            )}
          </div>
        </section>

        <section id="features" className="features" aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">{c.features.title}</h2>
          <Feature l={l} n={0} shots={pair("phone-day")} />
          <Feature l={l} n={1} shots={pair("phone-day-b")} />
          <Feature l={l} n={2} shots={pair("phone-anniversary")} />
        </section>

        <section id="unlock" className="unlock" aria-labelledby="unlock-title">
          <div className="unlock-in">
            <h2 id="unlock-title" className="section-title">{c.unlock.title}</h2>
            <p className="unlock-body">{c.unlock.body}</p>
            <ul className="unlock-list">
              {c.unlock.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <p className="offline-note">{c.unlock.offlineNote}</p>
          </div>
        </section>

        <section id="devices" className="devices" aria-labelledby="devices-title">
          <h2 id="devices-title" className="section-title">{c.devices.title}</h2>
          <p className="devices-body">{c.devices.body}</p>
          <div className="devices-grid">
            <div className="devices-card">
              {pair("phone-settings") ? (
                <Device shots={pair("phone-settings")!} alt={`${c.hero.title} iPhone ${c.hero.chipDesignMock}`} chip={c.devices.iphoneCaption} />
              ) : (
                <DevicePlaceholder l={l} label={c.devices.iphoneCaption} />
              )}
            </div>
            <div className="devices-card">
              {pair("ipad") ? (
                <Device shots={pair("ipad")!} alt={`${c.hero.title} iPad ${c.hero.chipDesignMock}`} className="device--pad" chip={c.hero.chipDesignMock} />
              ) : (
                <div className="devices-card devices-card--placeholder" role="group" aria-label={c.devices.ipadPending}>
                  <span className="placeholder-mark" aria-hidden="true" />
                  <span className="placeholder-title">{c.devices.ipadPending}</span>
                  <span className="placeholder-note">{c.hero.chipDesignMock}</span>
                </div>
              )}
            </div>
          </div>
          <p className="devices-note">{c.devices.placeholderNote}</p>
        </section>

        <section id="duo" className="duo" aria-labelledby="duo-title">
          <h2 id="duo-title" className="section-title">{c.duo.title}</h2>
          <p className="duo-body">{c.duo.body}</p>
          <div className="duo-grid">
            {(["duo-outer", "duo-open", "duo-tabletop", "duo-tent"] as const).map((key, i) => {
              const shots = pair(key);
              const pose = c.duo.poses[i];
              return (
                <figure key={key} className={`duo-card${key === "duo-open" || key === "duo-tent" ? " duo-card--wide" : ""}`}>
                  {shots ? (
                    <Device shots={shots} alt={`${c.duo.title} ${pose.label}`} className={`device--${key}`} chip={`Duo · ${pose.label}`} />
                  ) : (
                    <DevicePlaceholder l={l} label={pose.label} />
                  )}
                  <figcaption className="duo-cap"><b>{pose.label}</b><span>{pose.caption}</span></figcaption>
                </figure>
              );
            })}
          </div>
          <p className="duo-note">{c.duo.note}</p>
        </section>

        <section id="download" className="download" aria-labelledby="download-title">
          <h2 id="download-title" className="section-title">{c.download.title}</h2>
          <p className="download-body">{c.download.body}</p>
          <ul className="download-points">{c.download.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <div className="download-row">
            <span className="pill" aria-disabled="true" data-testid="download-prelaunch">{c.download.cta}</span>
            <a className="text-link" href={`mailto:${SITE.supportEmail}`}>{c.download.support}</a>
          </div>
        </section>
      </main>
      <SiteFooter l={l} />
      <nav className="bottom-bar" aria-label={c.download.title}>
        <span className="pill" aria-disabled="true">{c.download.bottomBar}</span>
      </nav>
    </div>
  );
}
