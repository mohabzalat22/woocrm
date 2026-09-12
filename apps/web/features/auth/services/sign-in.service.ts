export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
}

export class SignInService {
  private readonly baseUrl: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async signIn({
    email,
    password,
  }: SignInCredentials): Promise<SignInResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    return (await response.json()) as SignInResponse;
  }
}
