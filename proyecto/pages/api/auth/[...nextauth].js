import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Look up the user by email
        const user = await prisma.usuario.findUnique({
          where: { correo: email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Validate the password using bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        // If authentication is successful, return the user object
        return {
          id: user.correo,  // Use email as the unique ID
          email: user.correo,
          name: user.nombre_usuario,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When a user signs in, add their information to the token
      if (user) {
        token.id = user.id;  // Store email as the user ID
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the token data to the session object
      if (token) {
        session.user.id = token.id;  // Use email as the ID
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  session: {
    jwt: true,  // Use JWT for session tokens
  },
  jwt: {
    secret: process.env.JWT_SECRET,  // Ensure you have a JWT secret
  },
  pages: {
    signIn: '/auth/signin',  // Redirect here if not signed in
  },
  secret: process.env.NEXTAUTH_SECRET,  // Ensure a secret is set for NextAuth
});
