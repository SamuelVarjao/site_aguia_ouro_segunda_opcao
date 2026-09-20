import Image from "next/image";
import { withBase } from "@/lib/paths";

type Props = {
  /**
   * Caminho em /public/img. `null` renderiza um placeholder com a proporção
   * final — nada de banco de imagens: foto genérica de laboratório destrói
   * exatamente a credibilidade que a seção existe para construir.
   */
  src: string | null;
  alt: string;
  /** Descrição da foto que falta, visível no placeholder. */
  hint: string;
  sizes: string;
  className?: string;
  /** Ajuste de enquadramento, ex. "object-top" para não cortar uma placa. */
  imgClassName?: string;
};

export default function Photo({
  src,
  alt,
  hint,
  sizes,
  className,
  imgClassName,
}: Props) {
  return (
    <div
      className={`photo-frame relative overflow-hidden rounded-card shadow-sm ${className ?? ""}`}
    >
      {src ? (
        <Image
          src={withBase(src)}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover ${imgClassName ?? ""}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-dashed border-border-subtle bg-navy-050 p-4">
          <span className="t-small text-center text-navy-600/70">{hint}</span>
        </div>
      )}
    </div>
  );
}
