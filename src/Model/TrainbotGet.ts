export interface TrainbotGet {
    intentId: number;
    intentName: string;
    keywords: Keyword[];
    responsesId: number; // This seems redundant if you already have a list of `Response`
    responses: Response[];
  }
  
  export interface Keyword {
    keywordsId: number;
    keywords: string; // In TypeScript, we typically use camelCase for property names
  }
  
  export interface Response {
    responsesId: number;
    responses: string; // In TypeScript, we typically use camelCase for property names
  }