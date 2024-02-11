import { components, settings, util } from "replugged";

const { Clickable, Category, Divider, Flex, SwitchItem, SelectItem, Text, Tooltip } = components;
const boom = new Audio(
  "https://raw.githubusercontent.com/lisekilis/Replugged-Timestamps/main/audio/vineBoom.wav",
);
const cfg = await settings.init("dev.lisekilis.RepluggedTimestamps");
// function for making a table
/*
export function FormatRow({
  display,
  example,
}: {
  display: string;
  example: string;
}): React.ReactElement {
  return (
    <Flex>
      <Flex.Child grow={2} shrink={0}>
        <Text.H2>{display}</Text.H2>
      </Flex.Child>
      <Flex.Child grow={3} shrink={0}>
        <Text.H2 markdown>{example}</Text.H2>
      </Flex.Child>
    </Flex>
  );
}
*/
export function Settings(): React.ReactElement {
  const dateFormatProps = util.useSetting(cfg, "format", "dmy");
  dateFormatProps.onChange = ((passOn: (value: string) => void, value: string): void => {
    if (value === "ydm" || value === "mdy") {
      void boom.play();
    }
    passOn(value);
  }).bind(null, dateFormatProps.onChange);
  /*
    <FormatRow display={"t-hh:mm"} example={"<t:1692525600:t>"} />
    <Divider />
    <FormatRow display={"T-hh:mm:s"} example={"<t:1692525600:T>"} />
    <Divider />
    <FormatRow display={"d-hh:mm"} example={"<t:1692525600:d>"} />
    <Divider />
    <FormatRow display={"D-hh:mm"} example={"<t:1692525600:D>"} />
    <Divider />
    <FormatRow display={"f-hh:mm"} example={"<t:1692525600:f>"} />
    <Divider />
    <FormatRow display={"F-hh:mm"} example={"<t:1692525600:F>"} />
    <Divider />
    <FormatRow display={"R-hh:mm"} example={"<t:1692525600:R>"} />
  */
  return (
    <>
      <SwitchItem {...util.useSetting(cfg, "prefix", true)}>Required Prefix</SwitchItem>
      <Category title="Formatting">
        <table border={1}>
          <tr>
            <td>
              <Text.H2 markdown>{"t-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:t>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"T-hh:mm:ss"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:T>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"d-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:d>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"D-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:D>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"f-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:f>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"F-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:F>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"R-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:R>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"F-10.10.2007 4:20"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1191982800:F>"}</Text.H2>
            </td>
          </tr>
        </table>
      </Category>
      <Category title="Date Format">
        <SelectItem //TODO: add a sound for when mdy or ydm is selected
          {...dateFormatProps}
          options={[
            {
              label: "DD/MM/YYYY",
              value: "dmy",
            },
            {
              label: "MM/DD/YYYY",
              value: "mdy",
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
      <Clickable
        onClick={() =>
          window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html")
        }>
        {<Text.H2>♪(^∇^*)</Text.H2>}
      </Clickable>
    </>
  );
}
