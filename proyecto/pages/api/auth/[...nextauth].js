// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';  // To hash and compare passwords

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. Check if the user exists and password is valid
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Password is correct
          return { id: user.id, email: user.email };  // Valid user
        }

        // 3. If no user or password is incorrect, return null (auth fails)
        return null;
      }
    })
  ],

  // Enable JWT session management
  session: {
    jwt: true,
  },

  // Define how JWT is created
  jwt: {
    secret: process.env.JWT_SECRET,  // Store this in your .env file
  },

  // Optional: Customize the login/logout redirect behavior
  pages: {
    signIn: '/auth/signin',  // Custom login page
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  // Callbacks to handle user session
  callbacks: {
    async jwt(token, user) {
      // If user is provided (i.e., on initial login), add ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      // Attach the user ID from token to session
      session.user.id = token.id;
      return session;
    }
  }
});
