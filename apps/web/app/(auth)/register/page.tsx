import Image from "next/image";
import { RegisterCard } from "@/components/ui/register-card";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12">
      <div className="hidden w-full md:block">
        <Image
          src="/signin.png"
          width={500}
          height={500}
          alt="create account illustration"
          className="mx-auto h-auto w-full max-w-md"
        />
      </div>
      <div className="w-full">
        <RegisterCard />
      </div>
    </div>
  );
}
