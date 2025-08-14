import axios from 'axios'


export const createMedia = async ({title, description, mediaUrl, clerkId, ownerId}: CreateMediaProps) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ad/createMedia`, {
            "title": title,
            "description": description,
            "mediaUrl": mediaUrl,
            "clerkId": clerkId,
            "ownerId": ownerId
        })

        return response;
    } catch (error: any) {
        console.log(error)
        return error.message
    }
}


export const getMedia = async ({ownerId}: {ownerId: string}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ad/getMedia/${ownerId}`);

        return response;
    } catch (error) {
        console.log(error)
    }
}