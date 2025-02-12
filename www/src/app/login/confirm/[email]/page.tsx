"use client"

import { useParams, useRouter } from 'next/navigation'
import EmailConfirmCard from '../../emailConfirmCard'

export default function EmailConfirmView() {
    const router = useRouter()
    const { email } = useParams()

    if (!email) {
        router.push("/")
        return null
    }

    return (
        <EmailConfirmCard email={email as string} />
    )
}