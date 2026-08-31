import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/shared/brand";

/**
 * The fade has to reach zero *before* the element's top edge — a mask still
 * partly opaque at the boundary just draws a softer straight line. Vertical
 * radius under 100% is what buys that.
 */
const MASK =
  "radial-gradient(132% 97% at 50% 100%, #000 68%, rgba(0,0,0,0.62) 84%, transparent 97%)";

/**
 * Landing page footer — the whole painting, with the footer floating over it.
 *
 * The band carries the image's own 1376×768 ratio, so `object-cover` has
 * nothing to crop: every viewport sees the entire scene, sky included. From
 * `lg` up the links sit directly on the painting's lower half; below that the
 * columns stack taller than the painting is tall, so they flow onto the ink
 * ground the scrim already fades into. Only the scrim buys the contrast — the
 * painting is bright everywhere, so white type cannot sit on it bare.
 *
 * The band has no edges: `MASK` feathers the image out toward the top and the
 * corners so the scene emerges from the paper. Curving the edge with a
 * border-radius clip was the first attempt and it only traded a straight cut
 * for a curved one.
 */
export async function MarketingFooter() {
  const t = await getTranslations("landing");
  const tCommon = await getTranslations("common");

  const product = [
    "/dashboard",
    "/assistant",
    "/diagnosis",
    "/weather",
    "/marketplace",
  ];
  const company = ["/learning", "/community", "/vets", "/finance"];

  return (
    <footer className="relative isolate bg-[#141f17] text-white">
      {/* The painting rises out of the page instead of butting against it —
          the sky dissolves into paper and the corners fall away first, which
          is the arc. Paper sits on this wrapper rather than the footer:
          wherever the mask thins, what shows through is whatever is behind
          the band, and the footer's own ground is ink. */}
      <div className="bg-background">
        <div className="relative aspect-[1376/768] w-full">
          <Image
            src="/images/flocksy_pastoral_footer_1787661130751.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{
              // Ellipse anchored at the bottom: solid where the type sits,
              // feathering out toward the crown and further at the corners,
              // which is the arc. Clipping to a curve only trades a straight
              // edge for a curved one — the edge itself has to go.
              maskImage: MASK,
              WebkitMaskImage: MASK,
            }}
          />
          {/* Below lg the type flows underneath, so only the seam needs hiding. */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#141f17] lg:hidden" />
        </div>
      </div>

      {/* The scrim rides the content block, so it darkens exactly as far as
          the type reaches and leaves the rest of the painting alone — a
          fraction of the band would guess, and guessed wrong at 1440. */}
      <div
        className="lg:absolute lg:inset-x-0 lg:bottom-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,27,20,0) 0px, rgba(17,27,20,0.55) 72px, rgba(17,27,20,0.90) 152px, rgba(16,25,19,0.95) 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-6 lg:pt-32">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2">
              <span className="inline-flex items-center gap-2.5">
                <BrandMark />
                <span className="text-lg font-semibold tracking-tight">
                  Flocksy
                </span>
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-white/80">
                {t("footerTagline")}
              </p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.18em] text-white/65">
                {t("footerProduct")}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {product.map((href) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="capitalize text-white/85 underline-offset-4 hover:text-white hover:underline"
                    >
                      {href.replace("/", "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.18em] text-white/65">
                {t("footerCompany")}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {company.map((href) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="capitalize text-white/85 underline-offset-4 hover:text-white hover:underline"
                    >
                      {href.replace("/", "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-white/20 pt-8 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {tCommon("appName")}.{" "}
              {t("footerBuilt")}
            </p>
            <div className="flex gap-8">
              <a
                href="#"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                {t("footerPrivacy")}
              </a>
              <a
                href="#"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                {t("footerTerms")}
              </a>
              <a
                href="#"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                {t("footerContact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
