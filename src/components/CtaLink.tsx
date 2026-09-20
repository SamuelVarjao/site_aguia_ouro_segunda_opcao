import type { ReactNode } from "react";

type ConversionEvent = "contato_whatsapp" | "ir_para_loja";

type Props = {
  href: string;
  /** Configurar os dois como conversão no GA4. */
  event: ConversionEvent;
  /** Seção de onde partiu o clique. */
  origem: string;
  className?: string;
  children: ReactNode;
};

/**
 * Âncora comum, renderizada no servidor: funciona com JavaScript desativado.
 * O evento do GA4 sai de um listener delegado no SiteInteractions, que lê os
 * data-attributes abaixo — assim nenhum CTA precisa virar componente de cliente
 * só para disparar um evento.
 */
export default function CtaLink({
  href,
  event,
  origem,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-ga-event={event}
      data-ga-origem={origem}
    >
      {children}
    </a>
  );
}
