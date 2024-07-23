export interface findResult {
  prefix: string | null;
  date: Date;
  index: number;
  length: number;
  nextIndex: number;
}
export interface findPrefixResult {
  prefix: string;
  index: number;
  length: number;
  nextIndex: number;
}
export interface findTextResult {
  text: string;
  offset: number;
  index: number;
  length: number;
  nextIndex: number;
}
export interface findDateResult {
  year: number;
  month: number;
  day: number;
  index: number;
  length: number;
  nextIndex: number;
}
export interface findTimeResult {
  hour: number;
  minute: number;
  second: number;
  ms: number;
  index: number;
  length: number;
  nextIndex: number;
}
