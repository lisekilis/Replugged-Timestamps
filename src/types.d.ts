export interface findResult {
  prefix: string | null;
  date: Date;
  index: number;
  length: number;
}
export interface prefixFindResult {
  prefix: string;
  index: number;
  length: number;
}
export interface dateFindResult {
  year: number;
  month: number;
  day: number;
  index: number;
  length: number;
}
export interface timeFindResult {
  hour: number;
  minute: number;
  second: number;
  index: number;
  length: number;
}
