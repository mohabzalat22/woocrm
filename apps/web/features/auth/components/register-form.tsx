"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "#/ui/components/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/ui/components/card";
import { Input } from "#/ui/components/input";
import { Label } from "#/ui/components/label";
import { useRegister } from "../hooks/register";
import { RegisterSchema } from "../schemas";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const register = useRegister();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const validation = RegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Invalid registration details",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await register.mutateAsync(validation.data);
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to register in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl rounded-[1.5rem] border border-border/70 bg-white shadow-xl shadow-[#202820]/5">
      <CardHeader className="grid-cols-1 gap-2 px-6 pb-2 pt-7 sm:grid-cols-[1fr_auto] sm:px-8 sm:pt-8">
        <CardTitle className="text-3xl font-semibold tracking-tight">Create your account</CardTitle>
        <CardDescription>
          Set up your workspace in a few quick steps.
        </CardDescription>
        <CardAction className="col-auto row-auto mt-2 justify-self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:mt-0 sm:justify-self-end">
          <Button asChild variant="link" className="px-0">
            <Link href="/login">Sign in</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-6 py-6 sm:px-8">
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11 rounded-xl px-3"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="wasel@example.com"
                className="h-11 rounded-xl px-3"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-11 rounded-xl px-3 pr-12"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <Eye className="size-5" aria-hidden="true" />
                  ) : (
                    <EyeOff className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-11 rounded-xl px-3 pr-12"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <Eye className="size-5" aria-hidden="true" />
                  ) : (
                    <EyeOff className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 border-0 bg-transparent px-6 pb-7 pt-0 sm:px-8 sm:pb-8">
        <Button
          form="register-form"
          type="submit"
          size="lg"
          className="h-11 w-full rounded-xl font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-11 w-full rounded-xl">
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
