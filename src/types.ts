import type socialIcons from "@assets/socialIcons";

export type Site = {
  website: string;
  developer: string;
  desc: string;
  title: string;
  bookAuthor: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  scheduledPostMargin: number;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];
