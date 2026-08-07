import { MemberSidebar } from "@/components/member/member-sidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      <MemberSidebar />
      <div className="flex flex-1 flex-col min-w-0">{children}</div>
    </div>
  );
}
