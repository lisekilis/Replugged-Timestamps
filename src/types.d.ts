export interface findResult {
  prefix: string | null;
  date: Date;
  index: number;
  length: number;
  endIndex: number;
}
export interface prefixFindResult {
  prefix: string;
  index: number;
  length: number;
  endIndex: number;
}
export interface textFindResult {
  text: string;
  offset: number;
  index: number;
  length: number;
  endIndex: number;
}
export interface dateFindResult {
  year: number;
  month: number;
  day: number;
  index: number;
  length: number;
  endIndex: number;
}
export interface timeFindResult {
  hour: number;
  minute: number;
  second: number;
  ms: number;
  index: number;
  length: number;
  endIndex: number;
}
