import { Metadata } from 'next'
import ChallengesClient from './ChallengesClient'

export const metadata: Metadata = {
    title: 'Active Challenges | Security Playground',
    description: 'Select a security module to start exploiting and patching real smart contract vulnerabilities.',
    openGraph: {
        title: 'Security Challenges | Security Playground',
        description: 'Learn smart contract security through interactive challenges',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 600,
                alt: 'Security Playground Challenges',
            },
        ],
    },
}

export default function ChallengesPage() {
    return <ChallengesClient />
}
