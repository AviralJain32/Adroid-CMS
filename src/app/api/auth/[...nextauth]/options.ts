import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import Google from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials.identifier,
          });

          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before login');
          }
          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            console.log(user);
            return user;
          } else {
            throw new Error('Incorrect Password');
          }
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    {
      id: 'orcid',
      name: 'ORCID',
      type: 'oauth',
      wellKnown: undefined, // Prevent the default .well-known resolution
      issuer: 'https://orcid.org', // Base URL for ORCID
      authorization: {
        url: 'https://orcid.org/oauth/authorize', // ORCID authorization endpoint
        params: {
          scope: '/authenticate', // ORCID's default scope for authentication
          response_type: 'code',
        },
      },
      token: 'https://orcid.org/oauth/token', // ORCID token endpoint
      userinfo: 'https://orcid.org/oauth/userinfo', // ORCID user info endpoint
      clientId: process.env.AUTH_ORCID_ID,
      clientSecret: process.env.AUTH_ORCID_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          fullname: profile.given_name + ' ' + profile.family_name, // Modify based on what ORCID provides in the user info response
          email: profile.email || null,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const newUser: any = user;
      if (user) {
        if (!user._id) {
          await dbConnect();
          const dbUser = await UserModel.findOne({ email: user.email });
          token._id = dbUser?._id?.toString() || user.id;
        } else {
          token._id = user._id;
        }
        token.isVerified = user.isVerified || newUser?.email_verified;
        token.email = user.email;
        token.fullname = (user.fullname as string) || (user.name as string);

        const tokenData = {
          id: user._id,
          username: user.fullname,
          email: user.email,
        };
        const createdtoken = await jwt.sign(
          tokenData,
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: '1d' },
        );
        token.accessToken = createdtoken;
      }

      if (account?.provider === 'google') {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.fullname = token.fullname as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ profile }) {
      await dbConnect();

      if (profile?.email) {
        let user = await UserModel.findOne({ email: profile.email });

        if (!user) {
          console.log('No user found, creating a new one...');

          user = new UserModel({
            fullname: profile.name,
            email: profile.email,
            password: 1234, // No password for OAuth users
            verifyCode: undefined,
            verifyCodeExpiry: undefined,
            forgotPasswordToken: undefined,
            forgotPasswordTokenExpiry: undefined,
            isVerified: true, // Google accounts are verified by default
            affilation: 'Enter Your Affilation',
            country: 'Enter Your Country',
            contactNumber: 123456,
            isReviewer: false,
          });

          await user.save();
          console.log('New user created:', user);
          // Redirect to complete-profile page
          return `/complete-profile?email=${profile?.email}`;
        }
      }

      return true;
    },
  },
  //jo override krna hai use access kro
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
