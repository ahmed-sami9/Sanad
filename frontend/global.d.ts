import type messages from "./messages/en.json";

// Makes t("...") keys type-checked: a typo in a message key is a compile error.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
