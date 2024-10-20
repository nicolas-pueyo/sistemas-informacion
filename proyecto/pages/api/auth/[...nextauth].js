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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },  // Add username field
        city: { label: "City", type: "text" }            // Add city field
      },
      async authorize(credentials) {
        const { email, password, username, city, isSignup } = credentials;

        if (isSignup) {
          const existingUser = await prisma.usuario.findUnique({
            where: { correo: email },
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          // Hash password and create new user with additional fields
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.usuario.create({
            data: {
              correo: email,
              password: hashedPassword,
              nombre_usuario: username,  // Save the username
              ciudad: city                // Save the city
            },
          });
          return { id: newUser.correo, email: newUser.correo };
        }

        // Handle login
        const user = await prisma.usuario.findUnique({
          where: { correo: email },
        });
        if (user && bcrypt.compareSync(password, user.password)) {
          console.log("User during login:", user);
          return { user:user };
        }

        return null;
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.user.correo; // Access nested 'user' object correctly
      }
      return token;
    },
    async session(session, token) {
      if (token.id) {
        session.user.id = token.id;
      } else {
        session.user.id = token.email;  // Use email as a fallback if id is missing
      }
      return session;
    }
  }
  
});
