<<<<<<< HEAD
=======
import type { Timestamp } from "firebase/firestore";

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string | Timestamp;
    updatedAt: string | Timestamp;
};
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

export type Subscription = {
    id: string;
    userId: string;
<<<<<<< HEAD
    status: 'active' | 'inactive' | 'cancelled';
    planName: string;
    price: number;
    currency: string;
    startDate: any; // Firestore Timestamp
    endDate: any; // Firestore Timestamp
    createdAt: any; // Firestore Timestamp
=======
    planId: 'basic' | 'pro' | 'enterprise' | 'growth' | 'scale' | 'ultimate';
    name: string;
    status: 'active' | 'inactive' | 'cancelled';
    startDate: string | Timestamp;
    endDate: string | Timestamp;
    createdAt: string | Timestamp;
    price: number;
    currency: string;
    transactionRef?: string;
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
};

export type EmailAnalytics = {
    id: string;
    userId: string;
    sent: number;
    delivered: number;
    bounced: number;
    opened: number;
    clickThroughRate: number;
<<<<<<< HEAD
    date: string; // ISO 8601 string
};

export type Sender = {
    id: string;
    userId: string;
    domain: string;
    status: 'pending' | 'verified' | 'failed';
    spfRecord: string;
    dkimRecord: string;
    dmarcRecord: string;
    createdAt: any; // Firestore Timestamp
}
=======
    date: string | Timestamp;
};
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
