import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({children}:{children: ReactNode}) {
  return (
    <div className="min-h-screen bg-[#f7f9f4] text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" aria-label="Wasel home" className="inline-flex items-center">
          <Image
            src="/wasel.svg"
            width={112}
            height={34}
            priority
            alt="Wasel"
            className="h-auto w-28"
          />
        </Link>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Simple conversations. Better relationships.
        </p>
      </header>

      <main>{children}</main>

      <footer className="mx-auto w-full max-w-7xl px-6 pb-6 text-center text-xs text-muted-foreground lg:px-10">
        © 2026 Wasel. All rights reserved.
      </footer>
    </div>
  );
}
