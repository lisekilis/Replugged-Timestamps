import { Injector, Logger, common } from "replugged";
import { cfg } from "./config";

export * from "./settings";

const { messages } = common;
const inject = new Injector();
const logger = Logger.plugin("Replugged-Timestamps");
const prefixRequired = cfg.get("prefix", true);

interface FindResult {
  prefix: string | null;
  date: Date;
  index: number;
  length: number;
}

function findDateTime(messageContent: string): FindResult | null {
  let totalLength = 0;

  //const prefixes = /(d-|D-|t-|T-|f-|F-|R-)([/w]{*})?(([0-1][0-9]|2[0-3]):([0-5][0-9])|24:00)/;
  const prefixes = /(d|D|t|T|f|F|R)-/;
  const match = prefixes.exec(messageContent);
  let prefix,
    index = null;
  if (match == null) {
    if (prefixRequired) return null;
    prefix = null;
  } else {
    prefix = match[1];
    totalLength += 2;
    index = match.index;
    messageContent = messageContent.slice(index + 2);
  }
  const format = cfg.get("format", "dmy");
  logger.log(
    `prefix: ${prefix}`,
    `index: ${index}`,
    `totalLength: ${totalLength}`,
    `format: ${format}`,
  );
  let dateMatch = null;
  switch (format) {
    case "dmy":
      dateMatch = /([0-2]?[0-9]|3[0-1])\.(1[0-2]|0?[0-9])\.(\d+)\b\s*/.exec(messageContent);
      if (dateMatch) {
        dateMatch = {
          length: dateMatch[0].length,
          day: dateMatch[1],
          month: dateMatch[2],
          year: dateMatch[3],
          index: dateMatch.index,
        };
      }
      break;
    case "mdy":
      dateMatch = /(1[0-2]|0?[0-9])\.([0-2]?[0-9]|3[0-1])\.(\d+)\b\s*/.exec(messageContent);
      if (dateMatch) {
        dateMatch = {
          length: dateMatch[0].length,
          day: dateMatch[2],
          month: dateMatch[1],
          year: dateMatch[3],
          index: dateMatch.index,
        };
      }
      break;
    case "ymd":
      dateMatch = /(\d+)\.(1[0-2]|0?[0-9])\.([0-2]?[0-9]|3[0-1])\b\s*/.exec(messageContent);
      if (dateMatch) {
        dateMatch = {
          length: dateMatch[0].length,
          day: dateMatch[3],
          month: dateMatch[2],
          year: dateMatch[1],
          index: dateMatch.index,
        };
      }
      break;
    case "ydm":
      dateMatch = /(\d+)\.([0-2]?[0-9]|3[0-1])\.(1[0-2]|0?[0-9])\b\s*/.exec(messageContent);
      if (dateMatch) {
        dateMatch = {
          length: dateMatch[0].length,
          day: dateMatch[2],
          month: dateMatch[3],
          year: dateMatch[1],
          index: dateMatch.index,
        };
      }
      break;
    default:
      break;
  }
  let date = null;
  if (dateMatch != null) {
    if (index == null) index = dateMatch.index;
    else if (dateMatch.index !== 0) dateMatch = null;
  }
  logger.log(`dateMatch: ${dateMatch}`);
  if (dateMatch != null) {
    let year = Number(dateMatch.year);
    if (dateMatch.year.length === 2 && cfg.get("shortYear", false)) {
      const currentYear = new Date().getFullYear();
      year += currentYear - (currentYear % 100);
    }
    date = [Number(dateMatch.day), Number(dateMatch.month) - 1, year];
    messageContent = messageContent.slice(dateMatch.index + dateMatch.length);
    totalLength += dateMatch.length;
  }
  let shortTimeMatch = /(0?[1-9]|1[0-2]):([0-5]?[0-9])\s*(am|pm)/i.exec(messageContent);
  let time;
  if (shortTimeMatch != null) {
    if (index == null) index = shortTimeMatch.index;
    else if (shortTimeMatch.index !== 0) shortTimeMatch = null;
  }
  if (shortTimeMatch != null) {
    totalLength += shortTimeMatch[0].length;
    let hour = Number(shortTimeMatch[1]);
    if (hour === 12) hour = 0;
    if (shortTimeMatch[3].toLowerCase() == "pm") {
      hour += 12;
    }
    time = [hour, Number(shortTimeMatch)];
  } else {
    let longTimeMatch = /([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])|24:00/.exec(messageContent);
    if (longTimeMatch != null) {
      if (index == null) index = longTimeMatch.index;
      else if (longTimeMatch.index !== 0) longTimeMatch = null;
    }
    logger.log(`index: ${index}`, `totalLength: ${totalLength}`);
    if (!longTimeMatch) return null;
    totalLength += longTimeMatch[0].length;
    if (longTimeMatch[0] === "24:00") {
      time = [0, 0];
    } else {
      time = [Number(longTimeMatch[1]), Number(longTimeMatch[2])];
    }
  }
  logger.log(`index: ${index}`, `totalLength: ${totalLength}`, `date: ${date}`);
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

function replaceTimestamp(content: string): string | null {
  let first = true;
  while (true) {
    const time = findDateTime(content);
    if (!time) {
      if (first) return null;
      return content;
    }
    first = false;
    const timestamp = getTimestamp(time.date, time.prefix);
    content = content.slice(0, time.index) + timestamp + content.slice(time.index + time.length);
  }
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.before(messages, "sendMessage", (_args) => {
    const orgContent = _args[1].content;
    const newContent = replaceTimestamp(orgContent);
    if (newContent) _args[1].content = newContent;
    return _args;
  });
  inject.before(messages, "editMessage", (_args) => {
    const orgContent = _args[2].content;
    const newContent = replaceTimestamp(orgContent);
    if (newContent) _args[2].content = newContent;
    return _args;
  });
}
export function stop(): void {
  inject.uninjectAll();
}
