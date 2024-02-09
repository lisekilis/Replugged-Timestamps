import { settings } from "replugged";

interface Settings {
  prefix?: boolean;
}

const defaultSettings = {
  prefix: true,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedTimestamps",
  defaultSettings,
);
