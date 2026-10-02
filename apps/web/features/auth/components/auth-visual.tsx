import Image from "next/image";
import { Check } from "lucide-react";

type AuthVisualProps = {
  mode: "login" | "register";
};

export function AuthVisual({ mode }: AuthVisualProps) {
  const isLogin = mode === "login";

  return (
    <section className="relative hidden min-h-[570px] overflow-hidden rounded-[2rem] bg-[#202820] p-10 text-white shadow-xl shadow-[#202820]/10 xl:flex xl:flex-col">
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 max-w-md">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {isLogin ? "Welcome back" : "Start with Wasel"}
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          {isLogin
            ? "Keep every customer conversation moving."
            : "A better way to work closer to your customers."}
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
          {isLogin
            ? "Bring your team, channels, and customer context together in one calm workspace."
            : "Create one shared workspace for your team and turn every message into a meaningful relationship."}
        </p>

        <div className="mt-8 space-y-3 text-sm text-white/80">
          {["One shared workspace", "Clear customer context", "Built for focused teams"].map(
            (feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {feature}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="relative z-10 mt-auto flex justify-end pt-10">
        <div className="w-[min(75%,330px)] rotate-2 rounded-[1.5rem] bg-[#f7f9f4] p-5 shadow-2xl shadow-black/20">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-[#d7ded2]" />
              <span className="size-2 rounded-full bg-[#d7ded2]" />
              <span className="size-2 rounded-full bg-[#d7ded2]" />
            </div>
            <span className="rounded-full bg-primary/20 px-2 py-1 text-[9px] font-semibold text-[#40521b]">
              {isLogin ? "Your workspace" : "Your team"}
            </span>
          </div>
          <Image
            src="/signin.png"
            width={470}
            height={486}
            alt=""
            aria-hidden="true"
            className="mx-auto h-auto w-full max-w-[210px] opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
