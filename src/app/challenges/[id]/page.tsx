import { Metadata } from 'next'
import { modules } from '@/lib/modules'
import ChallengeClient from './ChallengeClient'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const module = modules.find((m) => m.id === id)

    if (!module) {
        return {
            title: 'Challenge Not Found | Security Playground',
        }
    }

    const title = `${module.title} | Security Playground`
    const description = module.description

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://mirmohmmadluqman.github.io/security-pg/challenges/${id}`,
            images: [
                {
                    url: '/logo.png',
                    width: 800,
                    height: 600,
                    alt: module.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/logo.png'],
        },
    }
}

export default async function ChallengePage({ params }: Props) {
    const { id } = await params
    const module = modules.find((m) => m.id === id)

    if (!module) {
        notFound()
    }

    return <ChallengeClient challengeId={id} />
}
