import { Injector, common } from "replugged";
import { cfg } from "./config";

export * from "./settings";

const { messages } = common;
const inject = new Injector();
const prefixRequired = cfg.get("prefix", false);

function findPrefix(messageContent: string): { prefix: string | null; location: number | null } {
  const prefixes = /(d-|D-|t-|T-|f-|F-|R-)(([0-1][0-9]|2[0-3]):([0-5][0-9])|24:00)/;
  const match = messageContent.match(prefixes);

  if (match != null) {
    const prefix: string | null = match[0].slice(0, 1);
    const location = messageContent.search(prefixes);
    return { prefix, location };
  }
  return { prefix: null, location: null };
}
function getTime(messageContent: string, location?: number | null): string | null {
  messageContent = messageContent.toLowerCase();
  if (location) {
    messageContent = messageContent.slice(location, location + 8);
  }
  const worseTimeMatch = messageContent.match(
    /((0[1-9]|1[0-2]):[0-5][0-9] ?am)|((0[0-9]:[0-5][0-9]|1[0-1]:[0-5][0-9]|12:00) ?pm)/,
  );
  if (worseTimeMatch != null) {
    return worseTimeMatch[0];
  }
  const betterTimeMatch = messageContent.match(/([0-1][0-9]|2[0-3]):([0-5][0-9])|24:00/);
  return betterTimeMatch ? betterTimeMatch[0] : null;
}
function getTimestamp(time: string, prefix?: string | null): string {
  const colonLocation = time.indexOf(":");
  const currentDayTimestamp = Math.floor(Date.now() / 86400000) * 86400;
  const timezoneOffset = new Date().getTimezoneOffset();

  if (time.includes("am")) {
    time = time.slice(0, 5);
  }
  if (time.includes("pm")) {
    time = (Number(time.slice(0, 2)) + 12).toString() + time.slice(2, 5); // this is retarded but won't work otherwise
  }
  const seconds =
    Number(time.slice(0, colonLocation)) * 3600 +
    Number(time.slice(colonLocation + 1)) * 60 +
    timezoneOffset * 60;
  const timestamp = prefix
    ? `<t:${(currentDayTimestamp + seconds).toString()}:${prefix}>`
    : `<t:${(currentDayTimestamp + seconds).toString()}:t>`;

  return timestamp;
}

function replaceTimestamp(orgContent: string, orgTime: string, orgPrefix?: string | null): string {
  const Timestamp = getTimestamp(orgTime, orgPrefix); // this must be here or am and pm won't get passed through to getTimestamp
  if (orgTime.includes("am") || orgTime.includes("pm")) {
    orgContent =
      orgContent.slice(0, orgContent.toLowerCase().indexOf(orgTime) + 5) +
      orgContent.slice(orgContent.toLocaleLowerCase().indexOf(orgTime) + orgTime.length);
    orgTime = orgTime.slice(0, 5);
  }
  if (orgPrefix != null) {
    orgContent =
      orgContent.slice(0, orgContent.indexOf(orgTime) - 2) +
      orgContent.slice(orgContent.indexOf(orgTime));
  }
  const newContent = `${orgContent.slice(0, orgContent.indexOf(orgTime))}${Timestamp}${orgContent.slice(orgContent.indexOf(orgTime) + orgTime.length)}`;
  const newPrefix = findPrefix(newContent);
  const newTime: string | null = prefixRequired
    ? newPrefix.location
      ? getTime(newContent, newPrefix.location + 2)
      : null
    : getTime(newContent, newPrefix.location ? newPrefix.location + 2 : null);
  if (newTime != null) {
    return replaceTimestamp(newContent, newTime);
  }
  return newContent;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.before(messages, "sendMessage", (_args) => {
    const orgContent = _args[1].content;
    const prefix = findPrefix(orgContent);
    const time: string | null = prefixRequired
      ? prefix.location
        ? getTime(orgContent, prefix.location + 2)
        : null
      : getTime(orgContent, prefix.location ? prefix.location + 2 : null);
    if (time != null) {
      const newContent = replaceTimestamp(orgContent, time, prefix.prefix);
      _args[1].content = newContent;
    }

    return _args;
  });
}
export function stop(): void {
  inject.uninjectAll();
}
