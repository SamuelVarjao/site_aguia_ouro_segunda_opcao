import Image from "next/image";
import { withBase } from "@/lib/paths";

type Props = {
  /** "nav" na barra fixa, "footer" um pouco maior no rodapé. */
  size?: "nav" | "footer";
};

/**
 * Marca oficial (águia) + assinatura em texto real.
 *
 * O PNG vem do SVG do kit, rasterizado com fundo transparente. O SVG em si tem
 * 9,9 MB e é um raster embrulhado (95% do arquivo são dois PNGs em base64), por
 * isso não é servido direto. A assinatura continua sendo texto: além de pesar
 * menos, é lida por buscadores e leitores de tela.
 */
export default function Logo({ size = "nav" }: Props) {
  const nav = size === "nav";

  return (
    <span className={`flex items-center ${nav ? "gap-2 sm:gap-3" : "gap-3"}`}>
      <Image
        src={withBase("/img/logo-marca.png")}
        alt=""
        width={700}
        height={350}
        priority={nav}
        className={nav ? "h-7 w-auto sm:h-9" : "h-11 w-auto"}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-bold whitespace-nowrap tracking-[-0.01em] text-white ${
            nav ? "text-[1rem] sm:text-[1.375rem]" : "text-[1.375rem]"
          }`}
        >
          Águia de Ouro
        </span>
        {/* Na barra o subtítulo é branco, não dourado: com o cabeçalho
            transparente ele fica sobre o vídeo, onde o dourado dá 3,03:1 e
            reprova AA. No rodapé, sobre navy sólido, o dourado volta. */}
        <span
          className={`mt-1 whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.16em] ${
            nav ? "hidden text-white/70 sm:block" : "block text-gold-400"
          }`}
        >
          Farmácia de manipulação
        </span>
      </span>
    </span>
  );
}
