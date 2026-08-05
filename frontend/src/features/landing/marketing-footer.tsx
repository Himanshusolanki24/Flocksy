import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";

/** Landing page footer. */
export async function MarketingFooter() {
  const t = await getTranslations("landing");
  const tCommon = await getTranslations("common");

  const product = ["/dashboard", "/assistant", "/diagnosis", "/weather", "/marketplace"];
  const company = ["/learning", "/community", "/vets", "/finance"];

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Brand />
            <p className="max-w-sm text-sm text-muted-foreground">{t("footerDesc")}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footerProduct")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {product.map((href) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground">
                    {href.replace("/", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footerCompany")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {company.map((href) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground">
                    {href.replace("/", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {tCommon("appName")}. {t("footerRights")}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              {t("footerPrivacy")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("footerTerms")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("footerContact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}