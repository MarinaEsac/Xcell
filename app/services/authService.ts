import { signIn as nextAuthSignIn, SignInOptions } from "next-auth/react";

export const signIn = async (provider: string, options?: SignInOptions) => {
  try {
    const result = await nextAuthSignIn(provider, options);
    return result;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
