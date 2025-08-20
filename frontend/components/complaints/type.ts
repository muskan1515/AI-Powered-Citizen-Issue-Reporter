export interface Sentiment {
  label: string;
  confidence: number;
}

export interface Issue {
  label: string;
  confidence: number;
}

export interface NER {
  token: string;
  tag: string;
}

export interface AIAnalysis {
  sentiment?: Sentiment;
  issue?: Issue;
  ner?: NER[];
  urgency: string;
}

export interface Complaint {
  _id: string;
  userId: string;
  text: string;
  location: {
    lat: number;
    lng: number;
  };
  status: "open" | "in_progress" | "resolved";
  ai?: AIAnalysis;
  createdAt: string;
  updatedAt: string;
}