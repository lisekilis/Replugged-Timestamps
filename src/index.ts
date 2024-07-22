import { Injector, Logger, common } from "replugged";
import { cfg } from "./config";
import { dateFindResult, findResult, prefixFindResult, timeFindResult } from "./types";
export * from "./settings";

const { messages } = common;
const inject = new Injector();
const logger = Logger.plugin("Replugged-Timestamps");

function findPrefix(messageContent: string): prefixFindResult | null {
  const match = /(?<![^\s(])(?<prefix>d|D|t|T|f|F|R)-/.exec(messageContent);
  if (match)
    return {
      prefix: match.groups!.prefix,
      index: match.index,
      length: match[0].length,
    };
  return null;
}
function getPrefix(messageContent: string): prefixFindResult | null {
  let prefix = findPrefix(messageContent);
  if (prefix) return prefix;
  return {
    prefix: cfg.get("defaultPrefix", "t"),
    index: 0,
    length: 0,
  };
}
function findDate(
  messageContent: string,
  dateFormat: string,
  shortYear: boolean,
): dateFindResult | null {
  const year = /(?<year>\d+)/;
  const month = /(?<month>1[0-2]|0?[0-9])/;
  const day = /(?<day>[0-2]?[0-9]|3[0-1])/;
  let dateMatch;
  switch (dateFormat) {
    case "dmy":
      dateMatch = RegExp(`(?<![^\s(])${day}[./-]${month}[./-]${year}\b`).exec(messageContent);
      break;
    case "dym":
      dateMatch = RegExp(`(?<![^\s(])${day}[./-]${year}[./-]${month}\b`).exec(messageContent); // mental illness
      break;
    case "mdy":
      dateMatch = RegExp(`(?<![^\s(])${month}[./-]${day}[./-]${year}\b`).exec(messageContent);
      break;
    case "myd":
      dateMatch = RegExp(`(?<![^\s(])${month}[./-]${year}[./-]${day}\b`).exec(messageContent); // mental illness
      break;
    case "ymd":
      dateMatch = RegExp(`(?<![^\s(])${year}[./-]${month}[./-]${day}\b`).exec(messageContent);
      break;
    case "ydm":
      dateMatch = RegExp(`(?<![^\s(])${year}[./-]${day}[./-]${month}\b`).exec(messageContent);
      break;
    default:
      break;
  }
  const now = new Date();
  if (dateMatch) {
    if (shortYear && dateMatch.groups?.year.length === 2)
      dateMatch.groups.year += now.getFullYear() - (now.getFullYear() % 100);
    return {
      year: Number(dateMatch.groups!.year),
      month: Number(dateMatch.groups!.month),
      day: Number(dateMatch.groups!.day),
      index: dateMatch.index,
      length: dateMatch[0].length,
    };
  }
  return null;
}
function findTime(messageContent: string): timeFindResult | null {
  let shortTimeMatch =
    /(?<!\S)(?<hour>0?[1-9]|1[0-2]):(?<minute>[0-5]?[0-9])\s*(?<am_pm>am|pm)/i.exec(messageContent);
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
      index: shortTimeMatch.index,
      length: shortTimeMatch[0].length,
    };
  }
  let longTimeMatch = /(?<!\S)(?<hour>[0-1]?[0-9]|2[0-4]):(?<minute>[0-5]?[0-9])/.exec(
    messageContent,
  );
  if (longTimeMatch) {
    return {
      hour: Number(longTimeMatch.groups!.hour),
      minute: Number(longTimeMatch.groups!.minute),
      second: 0,
      index: longTimeMatch.index,
      length: longTimeMatch[0].length,
    };
  }
  return null;
}
function findDateTime(messageContent: string): findResult | null {
  let totalLength = 0;
  const prefix = getPrefix(messageContent);
  if (!prefix) return null;
  const date = findDate(
    messageContent.slice(prefix.index + prefix.length),
    cfg.get("format", "dmy"),
    cfg.get("shortYear", true),
  );
  const time = findTime(
    messageContent.slice(prefix.index + prefix.length + (date ? date.index + date.length : 0)),
  );

  totalLength += prefix?.index + prefix;

  const fullDate = date
    ? new Date(date[2], date[1], date[0], time[0], time[1])
    : (() => {
        let date = new Date();
        date.setHours(time[0]);
        date.setMinutes(time[1]);
        date.setSeconds(0);
        return date;
      })();
  return {
    prefix,
    date: fullDate,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    index: index!,
    length: totalLength,
  };
}

function getTimestamp(date: Date, prefix?: string | null): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  prefix ??= "t";
  const discordTimestamp = `<t:${timestamp}:${prefix}>`;
  return discordTimestamp;
}

function replaceTimestamp(content: string): string {
  const time = findDateTime(content);
  if (time)
    return `${content[time.index - 1] == "\\" ? content.slice(0, time.index - 1) : content.slice(0, time.index)}${content[time.index - 1] == "\\" ? content.slice(time.index, time.index + time.length) : getTimestamp(time.date, time.prefix)}${replaceTimestamp(content.slice(time.index + time.length, content.length))}`;
  else return content;
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
