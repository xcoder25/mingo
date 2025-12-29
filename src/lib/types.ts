import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
    id: string;
    email: string;
    fullName?: string;
    subscriptionPlan?: 'basic' | 'pro' | 'enterprise';
    subscriptionStatus?: 'active' | 'inactive';
    createdAt: string | Timestamp;
};

export type Subscription = {
    id: string;
    userId: string;
    planId: 'basic' | 'pro' | 'enterprise';
    name: string;
    status: 'active' | 'inactive' | 'cancelled';
    startDate: string | Timestamp;
    endDate: string | Timestamp;
    createdAt: string | Timestamp;
    price: number;
    currency: string;
    transactionRef?: string;
};

export type EmailAnalytics = {
    id: string;
    userId: string;
    sent: number;
    delivered: number;
    bounced: number;
    opened: number;
    clickThroughRate: number;
    date: string | Timestamp;
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

export type ApiKey = {
    id: string;
    userId: string;
    name: string;
    key: string; // This would be hashed in a real app
    createdAt: string | Timestamp;
}
