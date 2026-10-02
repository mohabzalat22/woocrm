import { SignInForm } from "@/features/auth/components/signin-form";
import { AuthVisual } from "@/features/auth/components/auth-visual";

export default function page() {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-105px)] w-full max-w-[1440px] items-center gap-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-14 xl:grid-cols-[minmax(0,1fr)_minmax(520px,600px)] xl:gap-20">
      <AuthVisual mode="login" />
      <div className="flex w-full items-center justify-center xl:py-8">
        <SignInForm />
      </div>
    </div>
  );
}
