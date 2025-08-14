import axios  from 'axios'

export const createCampaign = async ({clerkId, title, description, budget, format, audience, mediaId}: {
    clerkId: string;
    title: string;
    description: string;
    budget: number;
    format: string;
    audience: string;
    mediaId: string
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/create`, {
            clerkId, title, description, budget, format, audience, mediaId
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}