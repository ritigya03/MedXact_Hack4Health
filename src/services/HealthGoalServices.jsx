import { auth, db } from "../firebase";
import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export const addGoal = async (goal) => {
  if (!goal || !goal.name) {
    console.error("addGoal called with invalid goal:", goal);
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  const goalData = {
    ...goal,
    done: false,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "patients", user.uid, "healthGoals"), goalData);
};

export const fetchGoals = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const snapshot = await getDocs(
    collection(db, "patients", user.uid, "healthGoals")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateGoal = async (goalId, updates) => {
  const user = auth.currentUser;
  if (!user) return;

  const goalRef = doc(db, "patients", user.uid, "healthGoals", goalId);
  await updateDoc(goalRef, updates);
};

export const deleteGoal = async (goalId) => {
  const user = auth.currentUser;
  if (!user) return;

  const goalRef = doc(db, "patients", user.uid, "healthGoals", goalId);
  await deleteDoc(goalRef);
};

export const deleteAllGoals = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const snapshot = await getDocs(
    collection(db, "patients", user.uid, "healthGoals")
  );

  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, "patients", user.uid, "healthGoals", docSnap.id));
  }
};
