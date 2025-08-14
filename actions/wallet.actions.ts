import axios from "axios"


export const fundWallet = async ({ clerkId, amount}: { clerkId: string, amount: number}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wallet/fund`, {
            "clerkId": clerkId,
            "amount": amount
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}

export const getUserTransactions = async ({clerkId}: {clerkId: string}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wallet/${clerkId}`);

        return response;
    } catch (error) {
        console.log(error)
    }
}