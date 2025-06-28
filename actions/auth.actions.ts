import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


const { isLoaded, signUp, setActive } = useSignUp();

const router = useRouter();


 export const onSignUpPress = async ({ emailAddress, password }: {emailAddress: string, password: string}) => {
    if (!isLoaded) return

    // add meta data of last name and first name and usertype 
    try {
      await signUp.create({
        emailAddress,
        password,
      })


      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

 const onVerifyPress = async ({ code }: { code: string}) => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }