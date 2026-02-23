export type BlockType = 'theory' | 'code' | 'command' | 'output';

export interface ContentBlock {
    type: BlockType;
    value: string;
}

export interface TopicSection {
    blocks: ContentBlock[];
}

export interface Topic {
    id: string;
    title: string;
    sections: TopicSection[];
    createdAt: number;
}
