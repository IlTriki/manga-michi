export interface Manga {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    authors: string[];
    status: string;
    year?: number;
    tags: string[];
    lastChapter?: string;
}