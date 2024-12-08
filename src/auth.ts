// import { UserRole } from "@prisma/client";
// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// import { prisma } from "@/lib/prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import { Adapter } from "next-auth/adapters";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [Google, GitHub],
//   trustHost: true,
//   adapter: PrismaAdapter(prisma) as Adapter,
//   session: { strategy: "jwt" },
//   secret: process.env.AUTH_SECRET,
//   pages: {
//     signIn: "/pages/siginin",
//   },
//   callbacks: {
//     async session({ token, session }) {
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }

//       if (session.user) {
//         session.user.name = token.name;
//         session.user.email = token.email as string;
//         session.user.role = token.role as UserRole;
//       }

//       return session;
//     },
//     async jwt({ token }) {
//       if (!token.sub) return token;

//       const existingUser = await prisma.user.findUnique({
//         where: {
//           id: token.sub,
//         },
//       });

//       if (!existingUser) return token;

//       token.name = existingUser.name;
//       token.email = existingUser.email;
//       token.role = existingUser.role;

//       return token;
//     },
//   },
// });

// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";

// lib
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [Google, GitHub],
  pages: {
    signIn: "/pages/signin",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});
