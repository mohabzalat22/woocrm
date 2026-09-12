export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export class RegisterService {
  private readonly baseUrl: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async register({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterCredentials) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Error while Registering");
    }

    return response.json();
  }
}
