import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://astro-paper.pages.dev/", // replace this with your deployed domain
  developer: "Cruz Rakhmatov",
  bookAuthor: "Matt Pocock",
  desc: "A minimal website for Total TypeScript book by Matt Pocock.",
  title: "Total TypeScript Book by Matt Pocock",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/iamrakhmatov",
    linkTitle: ` ${SITE.developer} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/iamrakhmatov/",
    linkTitle: `${SITE.developer} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "team@totaltypescript.com",
    linkTitle: `Send an email to ${SITE.bookAuthor}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/iamrakhmatov",
    linkTitle: `${SITE.developer} on Twitter`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@mattpocockuk",
    linkTitle: `${SITE.bookAuthor} on YouTube`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://discord.com/channels/997886693233393714/997888903707107358",
    linkTitle: `${SITE.bookAuthor} on Discord`,
    active: false,
  },
];
