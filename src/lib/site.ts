/**
 * Dados da farmácia. Fonte única — rodapé, JSON-LD e metadados leem daqui.
 */
export const SITE_URL = "https://farmaciaaguiadeouro.com.br";

export const BUSINESS = {
  name: "Farmácia Águia de Ouro",
  legalName: "Farmácia Águia de Ouro LTDA",
  cnpj: "58.593.096/0001-29", // corrigido: o site atual mostra ".0001-29"
  foundingDate: "1988",
  street: "Av. Marechal Tito, 677 — 1º andar, sala 23",
  district: "São Miguel Paulista",
  city: "São Paulo",
  region: "SP",
  postalCode: "08010-090",
  /** Fixo oficial. O (11) 2956-3556 do site antigo foi descartado. */
  phone: "(11) 2297-5468",
  phoneE164: "+551122975468",
  whatsapp: "(11) 96422-4590",
  whatsappNumber: "5511964224590",
  email: "orcamentos@farmaciaaguiadeouro.com.br",
  hours: {
    weekdays: "Segunda a sexta, 8h30 às 17h30",
    saturday: "Sábado, 9h às 13h",
  },
  pharmacist: {
    name: "Midiã Castro Varjão de Melo",
    crf: "CRF-SP 44084",
  },
  licenses: {
    ae: "AE: 1.33195-4",
    afe: "AFE: 7.09751-0",
    crfCertificate: "Certidão de regularidade CRF/SP: 12460",
  },
} as const;

export const STORE_URL = "https://aguiadeouro.loja.pedidopago.com.br/";

export const INSTAGRAM = {
  handle: "@farmaciaaguiadeouro",
  url: "https://www.instagram.com/farmaciaaguiadeouro/",
} as const;

export const FACEBOOK_URL =
  "https://www.facebook.com/aguiadeourofarmaciaoficial/";

export const TIKTOK_URL = "https://www.tiktok.com/@farmcia.guia.de.o";

/**
 * Avaliações do perfil no Google Maps. Conferido manualmente em 17/09/2026 —
 * não é automático, então rating/count pedem atualização periódica.
 */
export const GOOGLE_REVIEWS = {
  ratingValue: "4.5",
  reviewCount: "182",
  bestRating: "5",
  url: "https://www.google.com/maps/place/Farm%C3%A1cia+%C3%81guia+de+Ouro/@-23.4937913,-46.4387785,17z/data=!4m6!3m5!1s0x94ce63df37366f6d:0xfc6d7bd6176c9053!8m2!3d-23.4937913!4d-46.4387785!16s%2Fg%2F1tdd1twx",
} as const;

function whatsappUrl(text: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Um texto pré-preenchido diferente por origem. É o único jeito de a farmácia
 * saber, dentro da própria conversa, de onde a pessoa clicou.
 */
export const WHATSAPP_LINKS = {
  nav: whatsappUrl("Olá! Vim pelo site e gostaria de enviar uma receita."),
  hero: whatsappUrl(
    "Olá! Vim pela página inicial do site e quero um orçamento para minha receita.",
  ),
  passos: whatsappUrl(
    "Olá! Segui o passo a passo do site e estou enviando minha receita.",
  ),
  flutuante: whatsappUrl(
    "Olá! Cliquei no botão do WhatsApp no site e gostaria de falar com a farmácia.",
  ),
  rodape: whatsappUrl(
    "Olá! Vi o número de WhatsApp no rodapé do site e quero falar com a farmácia.",
  ),
  servicos: whatsappUrl(
    "Olá! Vi os serviços no site e quero enviar minha receita.",
  ),
  quemSomos: whatsappUrl(
    "Olá! Conheci a história da farmácia no site e quero enviar minha receita.",
  ),
  contato: whatsappUrl(
    "Olá! Vim pela página de contato do site e quero enviar minha receita.",
  ),
} as const;

export function storeUrl(content: "hero" | "sem-receita" | "rodape"): string {
  return `${STORE_URL}?utm_source=lp&utm_medium=site&utm_campaign=home&utm_content=${content}`;
}
