import axios from "axios";


export const updateProfile = async ({rate, bio, specialties, imageUrl, clerkId}: {
    rate?: string, 
    bio?: string,
 specialties?: string[], 
 portfolio?: string[], 
 imageUrl?: string,
clerkId?: string;
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/updateProfile`, {
            rate, bio, specialties,  imageUrl, clerkId
        });

        return response
    } catch (error) {
        console.log(error)
    }
}


export const getUserbyId = async ({ clerkId} : {clerkId: string}) => {

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/getuserbyclerkId/${clerkId}`)

        return response;
    } catch (error) {
        console.log(error)
    }
}

export const getCreators = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/creators`);

        return response;
    } catch (error) {
        console.log(error)
    }
}

export const getCreatorbyId = async (id: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/creators/${id}`);

        return response;
    } catch (error) {
        console.log(error)
    }
}

export const getAppdata = async (clerkId: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/userdata/${clerkId}`);

        return response;
    } catch (error) {
        console.log(error)
    }
}