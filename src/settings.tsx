import { components, settings, util } from "replugged";

const { Clickable, Category, Divider, Flex, SwitchItem, SelectItem, Text, Tooltip } = components;
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
  const timestamp = Math.floor(Date.now() / 1000);
  // dateFormatProps.onChange = ((passOn: (value: string) => void, value: string): void => {
  //   if (value === "ydm" || value === "mdy") {
  //     void boom.play();
  //   }
  //   passOn(value);
  // }).bind(null, dateFormatProps.onChange);
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
              <Text.H2 markdown>{"t-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:t>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"T-__hh:mm__:ss"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:T>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"d-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:d>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"D-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:D>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"f-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:f>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"F-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:F>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"R-__hh:mm__"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:R>`}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{`F-${(() => {
                const date = new Date();
                switch (cfg.get("format", "dmy")) {
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
              })()} __${(() => {
                const date = new Date();
                return `${date.getHours()}/${date.getMinutes()}`;
              })()}__`}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{`<t:${timestamp}:F>`}</Text.H2>
            </td>
          </tr>
        </table>
      </Category>
      <Category title="Date Format">
        <SelectItem
          {...dateFormatProps}
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
      <Clickable
        onClick={() =>
          window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html")
        }>
        {<Text.H2>♪(^∇^*)</Text.H2>}
      </Clickable>
    </>
  );
}
