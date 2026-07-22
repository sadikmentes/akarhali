import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // 1 hour idle timeout: the session expires 1 hour after the last activity.
  // Any admin request within the window slides it forward (refreshed at most
  // every 5 minutes); after 1 hour with no activity the user is logged out.
  session: { strategy: "jwt", maxAge: 60 * 60, updateAge: 60 * 5 },
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Kullanıcı adı veya e-posta", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!login || !password) return null;

        const user = await userRepository.findByLogin(login);
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
