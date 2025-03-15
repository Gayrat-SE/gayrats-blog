import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Telegram",
      credentials: {
        telegramData: { label: "Telegram Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.telegramData) return null;
        
        const data = JSON.parse(credentials.telegramData);
        
        if (data.id.toString() !== process.env.ADMIN_TELEGRAM_ID) {
          throw new Error("Unauthorized: Only admin can login");
        }

        // Update or create telegram auth record
        const telegramAuth = await prisma.telegramAuth.upsert({
          where: { userId: data.id },
          update: {
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            lastLogin: new Date(),
          },
          create: {
            userId: data.id,
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
          },
        });

        return {
          id: telegramAuth.id,
          name: `${telegramAuth.firstName} ${telegramAuth.lastName}`.trim(),
          email: `${telegramAuth.username}@telegram.com`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST }; 