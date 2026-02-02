import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAIW21QucIJxV9KEjAK8tmLNAas9xxzDjU",
    authDomain: "airier-ff7a0.firebaseapp.com",
    projectId: "airier-ff7a0",
    storageBucket: "airier-ff7a0.firebasestorage.app",
    messagingSenderId: "1001569543833",
    appId: "1:1001569543833:web:b23d09afb548c15dddfa08",
    measurementId: "G-N3GV2K6TH8"
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