import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcrypt';
import { JWT } from '@auth/core/jwt';
import { Session, User } from '@auth/core/types';

// Extend the User, Session, and JWT interfaces
declare module '@auth/core/types' {
  interface User {
    role?: string;
    phone?: string;
    gender?: string;
    specialization?: string;
    rating?: number;
    isActive?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string;
      gender?: string;
      specialization?: string;
      rating?: number;
      isActive?: boolean;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
    phone?: string;
    gender?: string;
    specialization?: string;
    rating?: number;
    isActive?: boolean;
  }
}

// Initialize Firebase Admin
const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'patient-login',
      name: 'Patient Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Query Firestore for patient
          const userSnapshot = await db
            .collection('users')
            .where('email', '==', credentials.email)
            .where('role', '==', 'patient')
            .limit(1)
            .get();

          if (userSnapshot.empty) {
            return null;
          }

          const user = userSnapshot.docs[0].data();
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: userSnapshot.docs[0].id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            gender: user.gender,
            role: user.role,
          };
        } catch (error) {
          console.error('Patient auth error:', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'doctor-login',
      name: 'Doctor Login',
      credentials: {
        name: { label: 'Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.name || !credentials?.password) {
            return null;
          }

          // Query Firestore for doctor (exact match)
          const doctorSnapshot = await db
            .collection('doctors')
            .where('name', '==', credentials.name)
            .limit(1)
            .get();

          if (doctorSnapshot.empty) {
            return null;
          }

          const doctor = doctorSnapshot.docs[0].data();
          const isValidPassword = await bcrypt.compare(credentials.password, doctor.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: doctorSnapshot.docs[0].id,
            name: doctor.name,
            email: `${doctor.name.toLowerCase().replace(/\s+/g, '.')}@clinic.com`,
            specialization: doctor.specialization,
            rating: doctor.rating,
            isActive: doctor.isActive,
            role: doctor.role,
          };
        } catch (error) {
          console.error('Doctor auth error:', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Query Firestore for admin
          const adminSnapshot = await db
            .collection('users')
            .where('email', '==', credentials.email)
            .where('role', '==', 'admin')
            .limit(1)
            .get();

          if (adminSnapshot.empty) {
            return null;
          }

          const admin = adminSnapshot.docs[0].data();
          const isValidPassword = await bcrypt.compare(credentials.password, admin.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: adminSnapshot.docs[0].id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          console.error('Admin auth error:', error);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    firestore: db,
  }),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.gender = user.gender;
        token.specialization = user.specialization;
        token.rating = user.rating;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.gender = token.gender;
        session.user.specialization = token.specialization;
        session.user.rating = token.rating;
        session.user.isActive = token.isActive;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to hash passwords (for seeding data)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper function to get user by email from Firestore
export async function getUserByEmail(email: string) {
  const userSnapshot = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  return { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
}

// Helper function to get doctor by name from Firestore
export async function getDoctorByName(name: string) {
  const doctorSnapshot = await db
    .collection('doctors')
    .where('name', '==', name)
    .limit(1)
    .get();

  if (doctorSnapshot.empty) {
    return null;
  }

  return { id: doctorSnapshot.docs[0].id, ...doctorSnapshot.docs[0].data() };
}