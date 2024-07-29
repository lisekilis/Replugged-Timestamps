import { components, common, Logger, settings, util } from "replugged";
import { TooltipData } from "./types";
import { useEffect, useState } from "react";
import { replaceTimestamp } from ".";

const { Clickable, Category, Divider, Flex, SwitchItem, SelectItem, Text, Tooltip } = components;
const cfg = await settings.init("dev.lisekilis.RepluggedTimestamps");
const logger = Logger.plugin("Replugged-Timestamps");

function fullDate(date: Date, dateFormat: string): string {
  const etad = (() => {
    switch (dateFormat) {
      case "dmy":
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      case "dym":
        return `${date.getDate()}/${date.getFullYear()}/${date.getMonth()}`;
      case "mdy":
        return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
      case "myd":
        return `${date.getMonth()}/${date.getFullYear()}/${date.getDate()}`;
      case "ymd":
        return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
      case "ydm":
        return `${date.getFullYear()}/${date.getDate()}/${date.getMonth()}`;
      default:
        break;
    }
  })();
  return `${etad} __${date.getHours()}:${date.getMinutes()}__`;
}
class Tooltipper {
  private messages: string[] = [
    "no",
    "nah",
    "nope",
    "nuh uh",
    "NO",
    "STOP!",
    "alright, I'm going to let you close it",
    "jk",
    "will you ever stop?",
    "I'm getting annoyed",
    "alright I'm going to let you close it in:",
    "5",
    "4",
    "3",
    "2",
    "1",
    "눈_눈",
  ];
  private tooltipData: TooltipData = {
    lastClick: new Date(),
    index: 0,
    message: this.messages[0],
  };

  public getTooltip(): string {
    if (
      Date.now() - this.tooltipData.lastClick.valueOf() < 2500 &&
      this.tooltipData.index < this.messages.length
    ) {
      if (this.tooltipData.index === this.messages.length - 1) {
        window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html");
        close();
      }
      this.tooltipData.lastClick = new Date();
      this.tooltipData.index += 1;
      this.tooltipData.message = this.messages[this.tooltipData.index];
    } else {
      this.tooltipData.lastClick = new Date();
      this.tooltipData.index = 0;
      this.tooltipData.message = this.messages[0];
    }
    return this.tooltipData.message;
  }
}
let tooltipper = new Tooltipper();
// reset the preview values
cfg.set("previewPrefix", "t");
cfg.set("previewValue", "now");
// REACT(ㆆ_ㆆ)
export function Settings(): React.ReactElement {
  logger.log(components);
  const now = new Date();
  const timestamp = Math.floor(now.valueOf() / 1000);
  logger.log();
  const [tooltipState, setTooltipState] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleTooltipTrigger = () => {
    setTooltipState(true);
    setTooltipText(tooltipper.getTooltip());
  };
  useEffect(() => {
    if (tooltipState) {
      const timeoutId = setTimeout(() => {
        setTooltipState(false);
      }, 1000); // 1000 milliseconds = 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [tooltipState]);
  return (
    <>
      <Category title="Prefix">
        <SwitchItem {...util.useSetting(cfg, "prefix", true)}>Require Prefix</SwitchItem>
        <SelectItem
          {...util.useSetting(cfg, "defaultPrefix", "t")}
          options={[
            {
              label: `${(common.parser.parse(`<t:${timestamp}:t>`) as unknown as React.ReactElement[])[0].props.node.formatted} (ｔ-) `,
              value: "t",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:T>`) as unknown as React.ReactElement[])[0].props.node.formatted} (Ｔ-) `,
              value: "T",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:d>`) as unknown as React.ReactElement[])[0].props.node.formatted} (ｄ-) `,
              value: "d",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:D>`) as unknown as React.ReactElement[])[0].props.node.formatted} (Ｄ-) `,
              value: "D",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:f>`) as unknown as React.ReactElement[])[0].props.node.formatted} (ｆ-) `,
              value: "f",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:F>`) as unknown as React.ReactElement[])[0].props.node.formatted} (Ｆ-) `,
              value: "F",
            },
            {
              label: `${(common.parser.parse(`<t:${timestamp}:R>`) as unknown as React.ReactElement[])[0].props.node.formatted} (Ｒ-) `,
              value: "R",
            },
          ]}>
          Default prefix (used if no preifx is provided)
        </SelectItem>
      </Category>
      <Category title="Date Format">
        <SelectItem
          {...util.useSetting(cfg, "dateFormat", "dmy")}
          options={[
            {
              label: "DD/MM/YYYY",
              value: "dmy",
            },
            {
              label: "DD/YYYY/MM", // Mental illness
              value: "dym",
            },
            {
              label: "MM/DD/YYYY",
              value: "mdy",
            },
            {
              label: "MM/YYYY/DD", // Mental illness pt.2
              value: "myd",
            },
            {
              label: "YYYY/MM/DD",
              value: "ymd",
            },
            {
              label: "YYYY/DD/MM",
              value: "ydm",
            },
          ]}>
          Date format (separator doesn't matter)
        </SelectItem>
        <SwitchItem {...util.useSetting(cfg, "shortYear", false)}>
          Use short Year (2 digits)
        </SwitchItem>
      </Category>
      <Tooltip text={tooltipText} forceOpen={tooltipState} shouldShow={tooltipState}>
        <Category title="Timestamp Formats" open onChange={handleTooltipTrigger}>
          {/* this div uses noneexistent settings on Purpouse */}
          <div>
            <SelectItem
              {...util.useSetting(cfg, "previewPrefix", "t")}
              hideIcon
              options={[
                {
                  label: `t`,
                  value: "t",
                },
                {
                  label: `T`,
                  value: "T",
                },
                {
                  label: `d`,
                  value: "d",
                },
                {
                  label: `D`,
                  value: "D",
                },
                {
                  label: `f`,
                  value: "f",
                },
                {
                  label: `F`,
                  value: "F",
                },
                {
                  label: `R`,
                  value: "R",
                },
              ]}>
              Prefix
            </SelectItem>
            <Text.H2>-</Text.H2>
            <SelectItem
              {...util.useSetting(cfg, "previewValue", "now")}
              hideIcon
              options={[
                {
                  label: "now",
                  value: "now",
                },
                {
                  label: "1h 15m",
                  value: "1h 15m",
                },
                {
                  label: "20.08.2023 11:50 pm",
                  value: "20.08.2023 11:50 pm",
                },
                {
                  label: "4:20",
                  value: "4:20",
                },
              ]}>
              Time
            </SelectItem>
            <Text.H2>{"=>"}</Text.H2>
            <Text.H2 markdown>
              {replaceTimestamp(
                `${cfg.get("previewPrefix", "t")}-${cfg.get("previewValue", "now")}`,
              )}
            </Text.H2>
          </div>
          {/* <div
            className="owo_formatting" // I do not condone this class nomenclature
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content",
              columnGap: "10px",
              rowGap: "1px",
            }}>
            <Text.H1 markdown>{"Prefix example"}</Text.H1>
            <Text.H1 markdown>{"Timestamp"}</Text.H1>
            <Text.H2 markdown>{"t-__hh:mm__"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:t>`}</Text.H2>
            <Text.H2 markdown>{"T-__hh:mm__:ss"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:T>`}</Text.H2>
            <Text.H2 markdown>{"d-__hh:mm__"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:d>`}</Text.H2>
            <Text.H2 markdown>{"D-__hh:mm__"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:D>`}</Text.H2>
            <Text.H2 markdown>{"f-__hh:mm__"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:f>`}</Text.H2>
            <Text.H2 markdown>{`F-${fullDate(new Date(), cfg.get("dateFormat", "dmy"))}`}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp}:F>`}</Text.H2>
            <Text.H2 markdown>{"R-45s"}</Text.H2>
            <Text.H2 markdown>{`<t:${timestamp + 45}:R>`}</Text.H2>
          </div> */}
        </Category>
      </Tooltip>

      <Clickable
        onClick={() =>
          window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html")
        }>
        {<Text.H2>♪(^∇^*)</Text.H2>}
      </Clickable>
    </>
  );
}
