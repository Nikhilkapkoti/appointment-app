const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc, Timestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyD9y1mDmys2hQ04JvXIdXD940Dncty0x4M",
  authDomain: "quick-bite-48206.firebaseapp.com",
  projectId: "quick-bite-48206",
  storageBucket: "quick-bite-48206.appspot.com",
  messagingSenderId: "445304718589",
  appId: "1:445304718589:web:05cd8a39bb4d622e432a94",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixMissingCreatedAt() {
  try {
    const bookingsRef = collection(db, "bookings");
    const snapshot = await getDocs(bookingsRef);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const createdAt = data.createdAt;
      let needsUpdate = false;

      // Check for missing, invalid, or non-timestamp createdAt
      if (!createdAt || 
          (typeof createdAt === "string") || 
          (!(createdAt instanceof Timestamp) && !(createdAt instanceof Date))) {
        console.log(`Updating booking ${docSnap.id} with invalid or missing createdAt: ${createdAt}`);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateDoc(doc(db, "bookings", docSnap.id), {
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    }
    console.log("Finished checking and updating bookings");
  } catch (error) {
    console.error("Error fixing bookings:", error);
    process.exit(1);
  }
}

fixMissingCreatedAt();
