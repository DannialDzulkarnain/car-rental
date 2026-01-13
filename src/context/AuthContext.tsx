import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Fallback admin email for initial setup
const BOOTSTRAP_ADMIN_EMAIL = 'hazman5001@gmail.com';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        try {
          // Check/create user document in Firestore
          const userRef = doc(db, 'car-rental-users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            // User exists, check admin status and update last sign-in
            const userData = userSnap.data();
            setIsAdmin(userData.isAdmin === true);
            
            // Update last sign-in
            await setDoc(userRef, {
              lastSignIn: serverTimestamp(),
            }, { merge: true });
          } else {
            // New user - create document
            // Bootstrap admin check: if this is the bootstrap email, make them admin
            const isBootstrapAdmin = currentUser.email === BOOTSTRAP_ADMIN_EMAIL;
            
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              isAdmin: isBootstrapAdmin,
              lastSignIn: serverTimestamp(),
              createdAt: serverTimestamp(),
            });
            
            setIsAdmin(isBootstrapAdmin);
          }
        } catch (error) {
          console.error('Error checking/creating user document:', error);
          // Fallback to hardcoded check if Firestore fails
          setIsAdmin(currentUser.email === BOOTSTRAP_ADMIN_EMAIL);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
