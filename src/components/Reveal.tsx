import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  /** "up" (padrão), "left" ou "scale" — define de onde o elemento entra. */
  variant?: "up" | "left" | "scale";
  /** Atraso em ms, para escalonar itens de uma mesma lista. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Marca um bloco para ser revelado quando entrar na viewport.
 *
 * É um componente de servidor: só escreve os atributos. Quem observa e revela é
 * o SiteInteractions, com um listener único para a página inteira. O conteúdo
 * vai no HTML normalmente — quem esconde é o CSS, e só quando a classe .js
 * existe. Como a animação mexe apenas em opacidade e transform, o CLS fica em 0.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  children,
}: Props) {
  return (
    <Tag
      data-reveal={variant === "up" ? "" : variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
