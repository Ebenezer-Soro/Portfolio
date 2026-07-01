// Types globaux réexportés depuis le client Prisma + types utilitaires.
export type {
  Admin,
  Profile,
  Project,
  Skill,
  Experience,
  Service,
  Testimonial,
  SocialLink,
  SocialPost,
  Post,
  FAQ,
  ContactMessage,
  Visit,
  Media,
  SiteSetting,
} from "@prisma/client";

export type NavItem = {
  label: string;
  href: string;
};

export type StatItem = {
  label: string;
  value: number;
  suffix?: string;
};

export type VisitByDay = {
  date: string;
  count: number;
};

export type TopPage = {
  path: string;
  count: number;
};

export type DashboardStats = {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  unreadMessages: number;
  publishedProjects: number;
  publishedPosts: number;
  pendingTestimonials: number;
  visitsByDay: VisitByDay[];
  topPages: TopPage[];
};
