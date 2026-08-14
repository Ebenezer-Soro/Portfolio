import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { VisitTracker } from "@/components/public/VisitTracker";
import { AdminShortcut } from "@/components/public/AdminShortcut";
import { getProfile, getSocialLinks } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, socialLinks] = await Promise.all([getProfile(), getSocialLinks()]);

  return (
    <>
      <VisitTracker />
      <AdminShortcut />
      <Navbar profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </>
  );
}
