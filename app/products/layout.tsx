import { DynamicBreadcrumb } from "@/components/nav"
import { UserNav } from "@/components/auth/user-nav"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20 pb-8">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6">
          <DynamicBreadcrumb />
          <UserNav />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        {children}
      </main>
    </div>
  )
}
