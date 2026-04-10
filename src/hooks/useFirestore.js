import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

// Real-time listener for assignments (auto-updates when data changes)
export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy("deadline", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
};