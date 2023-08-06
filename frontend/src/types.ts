export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export interface ArtPiece {
  objectID: number;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectEndDate: number;
}

export interface ConvoContext {
  prompt: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
