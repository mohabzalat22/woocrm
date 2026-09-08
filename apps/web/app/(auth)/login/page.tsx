import { SignInCard } from "@/components/ui/signin-card";
import Image from "next/image";
export default function page() {
  return (
    <div className="grid min-h-screen grid-cols-1 items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12">
      <div className="hidden w-full md:block">
        <Image
          src="/signin.png"
          width={500}
          height={500}
          alt="signin image"
          className="mx-auto h-auto w-full max-w-md d-none xl:d-block"
        />
      </div>
      <div className="w-full">
        <SignInCard />
      </div>
    </div>
  );
}
