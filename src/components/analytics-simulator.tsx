'use client';

import { useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp, where, getDocs, Timestamp } from 'firebase/firestore';
import type { EmailAnalytics } from '@/lib/types';

function getStartOfTodayUTC(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export function AnalyticsSimulator() {
  const { user } = useUser();
  const firestore = useFirestore();

  const analyticsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/analytics`);
  }, [firestore, user]);

  useEffect(() => {
    if (!analyticsCollectionRef || !user) return;

    const intervalId = setInterval(async () => {
      try {
        const startOfToday = getStartOfTodayUTC();
        const q = query(
            analyticsCollectionRef, 
            where('date', '>=', Timestamp.fromDate(startOfToday)), 
            limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        let todayAnalyticsDoc;
        let todayAnalyticsData;

        if (querySnapshot.empty) {
          // No doc for today, create one
          todayAnalyticsData = {
            userId: user.uid,
            sent: 0,
            delivered: 0,
            bounced: 0,
            opened: 0,
            clickThroughRate: 0,
            date: serverTimestamp(),
          };
          // Use addDoc and get the ref
          const docRef = await addDocumentNonBlocking(analyticsCollectionRef, todayAnalyticsData);
          if(docRef) {
            todayAnalyticsDoc = { id: docRef.id, ...todayAnalyticsData };
          }
        } else {
          // Doc for today exists
          const doc = querySnapshot.docs[0];
          todayAnalyticsDoc = { id: doc.id, ...doc.data() } as EmailAnalytics;
          todayAnalyticsData = doc.data();
        }

        if (todayAnalyticsDoc && todayAnalyticsData) {
            // Increment values
            const newSent = (todayAnalyticsData.sent || 0) + Math.floor(Math.random() * 5) + 1;
            const newDelivered = Math.min(newSent, (todayAnalyticsData.delivered || 0) + Math.floor(Math.random() * 4) + 1);
            const newOpened = Math.min(newDelivered, (todayAnalyticsData.opened || 0) + (Math.random() > 0.5 ? 1 : 0));
            const newBounced = newSent - newDelivered;
            const newCtr = Math.random() * (7 - 2) + 2;


            const docRef = doc(analyticsCollectionRef, todayAnalyticsDoc.id);

            setDocumentNonBlocking(docRef, {
                sent: newSent,
                delivered: newDelivered,
                opened: newOpened,
                bounced: newBounced,
                clickThroughRate: newCtr,
            }, { merge: true });
        }
      } catch (error) {
        console.error('Error in analytics simulator:', error);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(intervalId);
  }, [analyticsCollectionRef, user]);

  return null; // This component doesn't render anything
}
