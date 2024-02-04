import { Injector, common } from "replugged";

const { messages } = common;
const inject = new Injector();

function getTime(messageContent: string): string | null {
  messageContent = messageContent.toLowerCase();
  const worseTimeMatch = messageContent.match(
    /((0[1-9]|1[0-2]):[0-5][0-9] ?am)|((0[0-9]:[0-5][0-9]|1[0-1]:[0-5][0-9]|12:00) ?pm)/,
  );
  if (worseTimeMatch != null) {
    return worseTimeMatch[0];
  } else {
    const betterTimeMatch = messageContent.match(/([0-1][0-9]|2[0-3]):([0-5][0-9])|24:00/);
    return betterTimeMatch ? betterTimeMatch[0] : null;
  }
}
function getTimestamp(time: string): string {
  const colonLocation = time.indexOf(":");
  const currentDayTimestamp = Math.floor(Date.now() / 86400000) * 86400;
  const timezoneOffset = new Date().getTimezoneOffset();

  if (time.includes("am")) {
    time = time.slice(0, 5);
  }
  if (time.includes("pm")) {
    time = Number(time.slice(0, 2) + 12).toString() + time.slice(2, 5);
  }
  const seconds =
    Number(time.slice(0, colonLocation)) * 3600 +
    Number(time.slice(colonLocation + 1)) * 60 +
    timezoneOffset * 60;
  const timestamp = `<t:${(currentDayTimestamp + seconds).toString()}:t>`;

  return timestamp;
}

function replaceTimestamp(orgContent: string, orgTime: string): string {
  if (orgTime.includes("am") || orgTime.includes("pm")) {
    orgContent =
      orgContent.slice(0, orgContent.toLowerCase().indexOf(orgTime) + 5) +
      orgContent.slice(orgContent.toLocaleLowerCase().indexOf(orgTime) + orgTime.length);
    orgTime = orgTime.slice(0, 5);
  }
  const newContent = `${orgContent.slice(0, orgContent.indexOf(orgTime))}${getTimestamp(orgTime)}${orgContent.slice(orgContent.indexOf(orgTime) + orgTime.length)}`;
  const newTime = getTime(newContent);
  if (newTime != null) {
    return replaceTimestamp(newContent, newTime);
  }
  return newContent;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.before(messages, "sendMessage", (_args) => {
    const orgContent = _args[1].content;
    const time = getTime(orgContent);
    if (time != null) {
      const newContent = replaceTimestamp(orgContent, time);
      _args[1].content = newContent;
    }
    return _args;
  });
}
export function stop(): void {
  inject.uninjectAll();
}
