
export type Subscription = {
    id: string;
    userId: string;
    status: 'active' | 'inactive' | 'cancelled';
    planName: string;
    price: number;
    currency: string;
    startDate: any; // Firestore Timestamp
    endDate: any; // Firestore Timestamp
    createdAt: any; // Firestore Timestamp
};

export type EmailAnalytics = {
    id: string;
    userId: string;
    sent: number;
    delivered: number;
    bounced: number;
    opened: number;
    clickThroughRate: number;
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
