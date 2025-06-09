// scripts/seedFirestore.js
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { hashPassword } = require('../src/lib/auth');

const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seedFirestore() {
  const hashedPassword = await hashPassword('password');

  await db.collection('users').doc('1').set({
    email: 'user@example.com',
    password: hashedPassword,
    name: 'John Doe',
    phone: '9876543210',
    gender: 'male',
    role: 'patient',
  });
  await db.collection('users').doc('2').set({
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin',
  });

  await db.collection('doctors').doc('1').set({
    name: 'Dr. John Smith',
    password: hashedPassword,
    specialization: 'Cardiologist',
    rating: 4.5,
    isActive: true,
    role: 'doctor',
  });
  await db.collection('doctors').doc('2').set({
    name: 'Dr. Jane Doe',
    password: hashedPassword,
    specialization: 'Dermatologist',
    rating: 4.8,
    isActive: true,
    role: 'doctor',
  });

  console.log('Firestore seeded successfully');
}

seedFirestore().catch(console.error);