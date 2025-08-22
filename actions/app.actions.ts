import axios from "axios";


export const createApp = async ({ clerkId, categoryName, title, audienceName }: {
    clerkId: string,
    categoryName: string;
    title: string;
    audienceName: string
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/app/create`, {
            clerkId, categoryName, title, audienceName
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}


export const getUserApps = async ({ clerkId, }: {
    clerkId: string,
   
}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/app/getUserApp/${clerkId}`);

        return response;
    } catch (error) {
        console.log(error)
    }
}