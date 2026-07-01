import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

// Layout fin commun à tout /admin (login + panel).
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
