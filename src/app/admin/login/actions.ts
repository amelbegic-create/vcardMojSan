"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string } | void> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    // next-auth throws a NEXT_REDIRECT for successful logins — re-throw it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw error;

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Pogrešan email ili lozinka." };
      }
      return { error: `Greška: ${error.type}` };
    }
    return { error: "Greška pri prijavi. Pokušajte ponovo." };
  }
}
