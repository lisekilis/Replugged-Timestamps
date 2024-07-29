import { settings } from "replugged";

interface Settings {
  prefix?: boolean;
  defaultPrefix?: string;
  dateFormat?: string;
  shortYear?: boolean;
  previewPrefix?: string;
  previewValue?: string;
}

const defaultSettings = {
  prefix: true,
  defaultPrefix: "t",
  dateFormat: "dmy",
  shortYear: true,
  previewPrefix: "t",
  previewValue: "now",
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedTimestamps",
  defaultSettings,
);
