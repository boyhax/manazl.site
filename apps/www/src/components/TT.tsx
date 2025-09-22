'use client'
import { useTranslate } from "@tolgee/react"

export default function TT(text: string) {
    const {t} = useTranslate()
    return t(text)
}