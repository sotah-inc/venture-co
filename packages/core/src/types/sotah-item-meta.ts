import { LocaleMapping, UnixTimestamp } from "./index";

export interface ISotahItemMeta {
  last_modified: UnixTimestamp;
  normalized_name: LocaleMapping;
  item_icon_meta: {
    icon_url: string;
    icon_object_name: string;
    icon: string;
  };
}
