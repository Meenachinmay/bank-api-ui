import {
  Inter,
  Roboto_Mono,
  Molle,
  VT323,
  Shippori_Mincho_B1,
  DotGothic16,
  Noto_Sans_JP
} from "next/font/google";

export const notosansjp = Noto_Sans_JP({
    subsets: ["latin"],
    display: "auto"
})

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const molle = Molle({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin", "vietnamese"],
});

export const shippori = Shippori_Mincho_B1({
  weight: ["700"],
  subsets: ["latin"],
});

export const dotgothic = DotGothic16({
  weight: ["400"],
  subsets: ["latin"],
});
