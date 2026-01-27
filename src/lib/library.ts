
import vulnerabilities from '@/data/vulnerability-library.json';

export interface Vulnerability {
    id: string;
    slug: string;
    title: string;
    description: string;
    mitigation: string;
    code: string;
    source: {
        name: string;
        url: string;
        repo: string;
    };
    severity: string;
    standard: string;
    category: string;
}

export function getAllVulnerabilities(): Vulnerability[] {
    return vulnerabilities as Vulnerability[];
}

export function getVulnerabilityBySlug(slug: string): Vulnerability | undefined {
    return (vulnerabilities as Vulnerability[]).find((v) => v.slug === slug);
}
