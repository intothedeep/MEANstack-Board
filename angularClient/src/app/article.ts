export class Article {
  seq: number;
  user : {
    id: string,
    name: string
  };
  content : string;
  subject : string;
  time: string;
};
