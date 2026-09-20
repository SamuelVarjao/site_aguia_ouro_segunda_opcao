type Props = {
  /** Cor da seção que termina. */
  from: string;
  /** Cor intermediária. Sem ela, um degradê de branco para navy passa por
   *  cinzas dessaturados e lê como borrão. */
  via?: string;
  /** Cor da seção que começa. */
  to: string;
  /** Faixa mais alta, para saltos de cor grandes (claro para navy). */
  tall?: boolean;
};

/**
 * Faixa de transição entre duas seções de fundo chapado, para que a virada de
 * cor seja um degradê curto em vez de uma linha dura.
 */
export default function SectionFade({ from, via, to, tall = false }: Props) {
  const stops = via ? `${from}, ${via} 45%, ${to}` : `${from}, ${to}`;

  return (
    <div
      aria-hidden="true"
      className={tall ? "h-28 md:h-40" : "h-16 md:h-24"}
      style={{ background: `linear-gradient(to bottom, ${stops})` }}
    />
  );
}
