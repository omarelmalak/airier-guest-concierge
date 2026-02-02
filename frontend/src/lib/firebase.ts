import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export async function uploadPropertyPhoto(file: File, userId: string) {
    // Generate unique filename to avoid overwrites
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    console.log("userID:", userId);

    // Path inside Firebase Storage - flat structure
    const fileRef = ref(
        storage,
        `user-property-photos/${userId}/${file.name}`
    );

    // Upload
    const snapshot = await uploadBytes(fileRef, file);

    // Get public URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}