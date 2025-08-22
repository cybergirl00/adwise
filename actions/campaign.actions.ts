import axios  from 'axios'

export const createCampaign = async ({clerkId, title, description, budget, format, audience, mediaId, category}: {
    clerkId: string;
    title: string;
    description: string;
    budget: number;
    format: string;
    audience: string;
    mediaId: string;
    category: string
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/create`, {
            clerkId, title, description, budget, format, audience, mediaId, category
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}


export const sendRequest = async ({creatorId, ownerId, title, description, category, numberofFiles, deadline, budget, requirements}: {
    creatorId: string,
 ownerId: string,
  title: string, 
  description: string,
 category: string, 
 numberofFiles: number,
  deadline: Date,
   budget: number,
   requirements: string[]
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/request/create`, {
            creatorId, ownerId, title, description, category, numberofFiles, deadline, budget, requirements
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}



export const getCreatorsRequest = async (clerkId: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/request/getCreatorRequest/${clerkId}`);
        return response;
    } catch (error) {
        console.log(error)
    }
}


export const getCreatorsRequestbetweenOwner = async (clerkId: string, ownerId: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/request/betweenOwner/${clerkId}/${ownerId}`);

        
        return response;
    } catch (error) {
        console.log(error)
    }
}

export const declineRequest = async ({requestId, clerkId}: {requestId: string, clerkId: string}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/request/decline/${requestId}/${clerkId}`);


        return response;
    } catch (error) {
        console.log(error)
    }
}

export const acceptRequest = async ({requestId, clerkId}: {requestId: string, clerkId: string}) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/request/approve/${requestId}/${clerkId}`);


        return response;
    } catch (error) {
        console.log(error)
    }
}


export const createSubmit = async ({requestId, creatorId, title, files} : {
    requestId: string, 
    creatorId: string, 
    title: string,
     files: string[]
}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/submit`, {
            requestId, creatorId, title, files
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}

export const approveSubmit = async ({mediaId, requestId}: {requestId: string, mediaId: string}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/submit/approve`, {
            mediaId, requestId
        });


        return response;
    } catch (error) {
        console.log(error)
    }
}

export const declineSubmit = async ({mediaId, requestId, note}: {requestId: string, mediaId: string, note?: string}) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaign/submit/decline`, {
            mediaId, requestId, note
        });


        return response;
    } catch (error) {
        console.log(error)
    }
}