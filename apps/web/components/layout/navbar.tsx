"use client";

import { useState } from "react";
import { Button } from "@repo/ui/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex flex-col gap-4 py-2 sm:block sm:min-h-12">
      <div className="flex w-full items-center justify-between sm:absolute sm:inset-y-2 sm:left-0 sm:flex sm:items-center">
        <h2 className="text-primary text-2xl font-bold sm:text-3xl">
          WASEL.now
        </h2>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border sm:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>
          <span className="flex w-4 flex-col gap-1">
            <span className="h-px w-full bg-foreground" />
            <span className="h-px w-full bg-foreground" />
            <span className="h-px w-full bg-foreground" />
          </span>
        </button>
      </div>

      <div
        id="primary-navigation"
        className={`${isMenuOpen ? "flex" : "hidden"} flex-col gap-4 sm:flex sm:flex-row sm:items-center sm:justify-end`}
      >
        <div className="grid grid-cols-1 gap-3 text-center sm:absolute sm:left-1/2 sm:top-1/2 sm:flex sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-8">
          <div>Products</div>
          <div>Pricing</div>
          <div>About</div>
          <div>Contact</div>
        </div>
        <div className="flex items-center justify-center gap-2 p-1 sm:justify-end">
          <span className="h-5 border-s-2"></span>
          <Button variant="outline">Login</Button>
          <Button className="bg-primary text-primary-foreground">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
