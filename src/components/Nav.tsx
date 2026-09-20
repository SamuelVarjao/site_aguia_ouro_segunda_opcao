import Link from "next/link";
import CtaLink from "./CtaLink";
import Logo from "./Logo";
import { WHATSAPP_LINKS } from "@/lib/site";

/**
 * Sem menu, sem hambúrguer, sem âncoras de seção: a página é curta e qualquer
 * link extra compete com a conversão.
 *
 * O data-nav é o gancho do SiteInteractions, que marca data-scrolled quando a
 * página sai do topo.
 */
export default function Nav() {
  return (
    <header
      data-nav
      data-scrolled="false"
      className="nav-bar surface-dark fixed inset-x-0 top-0 z-50 h-[72px]"
    >
      <div className="container-page flex h-full items-center justify-between gap-3 sm:gap-6">
        <Link href="/">
          <Logo />
        </Link>
        <CtaLink
          href={WHATSAPP_LINKS.nav}
          event="contato_whatsapp"
          origem="navegacao"
          className="btn btn-nav btn-gold shrink-0"
        >
          Enviar receita
        </CtaLink>
      </div>
    </header>
  );
}
