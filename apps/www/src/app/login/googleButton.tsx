"use client"
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function GoogleLoginBtn() {
    const router = useRouter();
    const supabase = createClient()
    // Google will pass the login credential to this handler
    const generateNonce = async (): Promise<string[]> => {
        const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32) as any)))
        const encoder = new TextEncoder()
        const encodedNonce = encoder.encode(nonce)
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

        return [nonce, hashedNonce]
    }
    
    async function load() {
        const [nonce, hashedNonce] = await generateNonce()
        console.log('Nonce: ', nonce, hashedNonce)
        const handleGoogle = async (response) => {
            try {
                // send id token returned in response.credential to supabase


                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: response.credential,
                    nonce,
                })

                if (error) throw error
                console.log('Session data: ', data)
                console.log('Successfully logged in with Google One Tap')

                // redirect to protected page
                router.push('/')
            } catch (error) {
                console.error('Error logging in with Google One Tap', error)
            }
        };
        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string, // Your client ID from Google Cloud
            callback: handleGoogle, // Handler to process login token
            nonce: hashedNonce,
            // with chrome's removal of third-party cookiesm, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
            use_fedcm_for_prompt: true,
        });

        // Render the Google button
        google.accounts.id.renderButton(
            document.getElementById("google-login-btn") as HTMLElement,
            {
                type: "standard",
                theme: "filled_blue",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
            }
        );

        google.accounts.id.prompt();
    }
    useEffect(() => {
        // We check every 300ms to see if google client is loaded
        const interval = setInterval(() => {
            if ((window as any).google as any) {
                clearInterval(interval);
                load()
            }
        }, 300);
    }, []); //eslint-disable-line

    return (
        <>
            <Script src="https://accounts.google.com/gsi/client" async defer></Script>
            <div id='google-login-btn' />
        </>
    );
}