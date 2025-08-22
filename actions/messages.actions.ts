import axios from "axios"


export const getPartners = async ({ clerkId}: { clerkId: string}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/messages/partners/${clerkId}`,);

        return response;
    } catch (error) {
        console.log(error)
    }
}

