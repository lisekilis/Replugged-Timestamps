import { Injector, Logger, common } from "replugged";
import { cfg } from "./config";
import {
  dateFindResult,
  findResult,
  prefixFindResult,
  textFindResult,
  timeFindResult,
} from "./types";
import { text } from "stream/consumers";
export * from "./settings";

const { messages } = common;
const inject = new Injector();
const logger = Logger.plugin("Replugged-Timestamps");

function findPrefix(content: string, index?: number): prefixFindResult | null {
  const regex = /(?<![^\s(])(?<prefix>d|D|t|T|f|F|R)-/;
  regex.lastIndex = index ?? regex.lastIndex;
  const match = regex.exec(content);
  if (match)
    return {
      prefix: match.groups!.prefix,
      index: match.index,
      length: match[0].length,
      endIndex: match.index + match[0].length,
    };
  return null;
}
function findText(content: string, index?: number): textFindResult | null {
  const regex =
    /^(now|((?<hour>\d+)h)?([, ]?(?<minute>\d+)m)?([, ]?(?<second>\d+)s)?([, ]?(?<ms>\d+)ms)?)/;
  regex.lastIndex = index ?? regex.lastIndex;
  const match = regex.exec(content);
  if (match && match[0] != "") {
    return {
      text: match[0],
      offset:
        Number(match.groups!.hour) * 36000000 +
        Number(match.groups!.minute) * 60000 +
        Number(match.groups!.second) * 1000 +
        Number(match.groups!.ms),
      index: match.index,
      length: match[0].length,
      endIndex: match.index + match[0].length,
    };
  }
  return null;
}

function findDate(
  content: string,
  dateFormat: string,
  shortYear: boolean,
  index?: number,
): dateFindResult | null {
  const year = /(?<year>\d+)/;
  const month = /(?<month>1[0-2]|0?[0-9])/;
  const day = /(?<day>[0-2]?[0-9]|3[0-1])/;
  let dateRegex;
  switch (dateFormat) {
    case "dmy":
      dateRegex = RegExp(`(?<![^\s(])${day}[./-]${month}[./-]${year}\b`);
      break;
    case "dym":
      dateRegex = RegExp(`(?<![^\s(])${day}[./-]${year}[./-]${month}\b`); // mental illness
      break;
    case "mdy":
      dateRegex = RegExp(`(?<![^\s(])${month}[./-]${day}[./-]${year}\b`);
      break;
    case "myd":
      dateRegex = RegExp(`(?<![^\s(])${month}[./-]${year}[./-]${day}\b`); // mental illness
      break;
    case "ymd":
      dateRegex = RegExp(`(?<![^\s(])${year}[./-]${month}[./-]${day}\b`);
      break;
    case "ydm":
      dateRegex = RegExp(`(?<![^\s(])${year}[./-]${day}[./-]${month}\b`);
      break;
    default:
      return null;
  }
  dateRegex.lastIndex = index ?? 0;
  const match = dateRegex.exec(content);
  const now = new Date();
  if (match) {
    if (shortYear && match.groups?.year.length === 2)
      match.groups.year += now.getFullYear() - (now.getFullYear() % 100);
    return {
      year: Number(match.groups!.year),
      month: Number(match.groups!.month),
      day: Number(match.groups!.day),
      index: match.index,
      length: match[0].length,
      endIndex: match.index + match[0].length,
    };
  }
  return null;
}
function findTime(content: string, index?: number): timeFindResult | null {
  const shortTimeRegex = /(?<!\S)(?<hour>0?[1-9]|1[0-2]):(?<minute>[0-5]?[0-9])\s*(?<am_pm>am|pm)/i;
  const longTimeRegex = /(?<!\S)(?<hour>[0-1]?[0-9]|2[0-4]):(?<minute>[0-5]?[0-9])/;
  shortTimeRegex.lastIndex = index ?? 0;
  longTimeRegex.lastIndex = index ?? 0;
  let shortTimeMatch = shortTimeRegex.exec(content);
  if (shortTimeMatch) {
    if (shortTimeMatch.groups?.am_pm.toLowerCase() == "pm" && shortTimeMatch.groups.hour != "12")
      shortTimeMatch.groups.hour = `${Number(shortTimeMatch.groups.hour) + 12}`;
    if (
      shortTimeMatch.groups?.hour == "12" &&
      shortTimeMatch.groups.minute == "00" &&
      shortTimeMatch.groups.am_pm.toLowerCase() == "am"
    )
      shortTimeMatch.groups.hour = "0";
    if (
      shortTimeMatch.groups?.hour == "00" &&
      shortTimeMatch.groups.minute == "00" &&
      shortTimeMatch.groups.am_pm.toLowerCase() == "pm"
    )
      shortTimeMatch.groups.hour = "24";
    return {
      hour: Number(shortTimeMatch.groups!.hour),
      minute: Number(shortTimeMatch.groups!.minute),
      second: 0,
      ms: 0,
      index: shortTimeMatch.index,
      length: shortTimeMatch[0].length,
      endIndex: shortTimeMatch.index + shortTimeMatch[0].length,
    };
  }
  let longTimeMatch = longTimeRegex.exec(content);
  if (longTimeMatch) {
    return {
      hour: Number(longTimeMatch.groups!.hour),
      minute: Number(longTimeMatch.groups!.minute),
      second: 0,
      ms: 0,
      index: longTimeMatch.index,
      length: longTimeMatch[0].length,
      endIndex: longTimeMatch.index + longTimeMatch[0].length,
    };
  }
  return null;
}
function findCrap(content: string): string | null {
  const crap = /\S*.*\S/gm;
  const match = crap.exec(content);
  if (match) return match[0];
  return null;
}
function findFullDate(content: string): findResult | null {
  const prefix = findPrefix(content);
  if (!prefix && cfg.get("prefix", false)) return null;
  const now = new Date();
  const text = prefix ? findText(content, prefix.index) : null;
  if (prefix && text)
    return {
      prefix: prefix.prefix,
      date: new Date(now.valueOf() + text.offset),
      index: prefix.index,
      length: prefix.length + text.length,
      endIndex: text.endIndex,
    };
  const date = findDate(
    content,
    cfg.get("format", "dmy"),
    cfg.get("shortYear", true),
    prefix ? prefix.endIndex : 0,
  );
  const time = findTime(content, date ? date.endIndex : prefix ? prefix.endIndex : 0);
  // edge case returns
  if (!time) return null;
  if (prefix && date)
    if (findCrap(content.slice(prefix.endIndex, date.index))) return prefix.endIndex;
  if (date && time) if (findCrap(content.slice(date.endIndex, time.index))) return date.endIndex;
  if (prefix && !date && time)
    if (findCrap(content.slice(prefix.endIndex, time.index))) return prefix.endIndex;
  let fullDate = new Date();
  if (date)
    fullDate = new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
  else
    fullDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      time.hour,
      time.minute,
      time.second,
      time.ms,
    );
  return {
    prefix: prefix ? prefix.prefix : null,
    date: fullDate,
    index: prefix ? prefix.index : date ? date.index : time.index,
    length:
      (prefix ? prefix.length : 0) +
      (text ? text.length : 0) +
      (date ? date.length : 0) +
      time.length,
    endIndex: text ? text.endIndex : time.endIndex,
  };
}

function getTimestamp(date: Date, prefix?: string | null): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  prefix ??= "t";
  const discordTimestamp = `<t:${timestamp}:${prefix}>`;
  return discordTimestamp;
}

function replaceTimestamp(content: string): string {
  const date = findFullDate(content);
  if (date)
    if (date.date)
      return `${content[date.index - 1] == "\\" ? content.slice(0, date.index - 1) : content.slice(0, date.index)}${content[date.index - 1] == "\\" ? content.slice(date.index, date.index + date.length) : getTimestamp(date.date, date.prefix)}${replaceTimestamp(content.slice(date.index + date.length, content.length))}`;

  return content;
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.before(messages, "sendMessage", (_args) => {
    _args[1].content = replaceTimestamp(_args[1].content);
    return _args;
  });
  inject.before(messages, "editMessage", (_args) => {
    _args[2].content = replaceTimestamp(_args[2].content);
    return _args;
  });
}
export function stop(): void {
  inject.uninjectAll();
}
