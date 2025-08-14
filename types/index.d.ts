interface CreateMediaProps {
    title: string, 
    description: string,
     mediaUrl: string,
    clerkId: string, 
    ownerId?: string
}


interface MediaProps {
    _id: string,
    title: string,
    ownerId: string,
    mediaUrl: string,
    description: string
}

interface TransactionProps {
    id: string;
    amount: number;
    desc: string;
    type: number;
    status: number;
    createdAt: string
}