import React from "react";

import { Button, Classes, Dialog, HTMLTable, Intent } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { IPricelistEntryJson, IShortItem, ItemId } from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../../../containers/util/ItemPopover";
import {
  BulkEntryFormFormContainer,
} from "../../../../form-containers/entry-point/PriceLists/util/BulkEntryForm";
import {
  CreateEntryFormFormContainer,
} from "../../../../form-containers/entry-point/PriceLists/util/CreateEntryForm";
import {
  ListFormFormContainer,
} from "../../../../form-containers/entry-point/PriceLists/util/ListForm";
import { IErrors } from "../../../../types/global";
import { FetchLevel } from "../../../../types/main";
import { ListDialogStep } from "../../../../types/price-lists";
import { qualityToColorClass } from "../../../../util";
import { DialogActions, DialogBody, ErrorList, PanelHeader } from "../../../util";

export interface IOnCompleteOptions {
  name: string;
  slug: string;
  entries: Array<{
    id?: number;
    item_id: number;
    quantity_modifier: number;
  }>;
  items: IShortItem[];
}

export interface IStateProps {
  items: IShortItem[];
}

export interface IOwnProps {
  isOpen: boolean;
  title: string;
  mutationErrors: IErrors;
  mutatePricelistLevel: FetchLevel;
  resetTrigger: number;
  defaultName?: string;
  defaultSlug?: string;
  defaultEntries?: IPricelistEntryJson[];

  onClose: () => void;
  onComplete: (opts: IOnCompleteOptions) => void;
}

export type Props = Readonly<IStateProps & IOwnProps>;

enum EntryMode {
  Set,
  Pick,
}

type State = Readonly<{
  listDialogStep: ListDialogStep;
  listName: string;
  listSlug: string;
  entries: IPricelistEntryJson[];
  entriesItems: IShortItem[];
  entryFormError: string;
  entryMode: EntryMode;
}>;

const defaultState: State = {
  entries: [],
  entriesItems: [],
  entryFormError: "",
  entryMode: EntryMode.Pick,
  listDialogStep: ListDialogStep.list,
  listName: "",
  listSlug: "",
};

export class ListDialog extends React.Component<Props, State> {
  public state: State = {
    ...defaultState,
  };

  public constructor(props: Props) {
    super(props);

    this.state = {
      ...defaultState,
      entries: props.defaultEntries ?? defaultState.entries,
      listName: props.defaultName ?? defaultState.listName,
    };
  }

  public componentDidUpdate(prevProps: Props): void {
    const { resetTrigger, defaultName, defaultSlug, defaultEntries } = this.props;

    if (prevProps.resetTrigger !== resetTrigger) {
      this.setState({
        entries: defaultEntries ?? [],
        entriesItems: [],
        listDialogStep: ListDialogStep.list,
        listName: defaultName ?? "",
        listSlug: defaultSlug ?? "",
      });

      return;
    }

    if (defaultName && defaultName !== prevProps.defaultName) {
      this.setState({ listName: defaultName });
    }
    if (defaultEntries && defaultEntries !== prevProps.defaultEntries) {
      this.setState({ entries: defaultEntries });
    }
  }

  public render(): React.ReactNode {
    const { isOpen, onClose, title } = this.props;

    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        icon="manually-entered-data"
        canOutsideClickClose={false}
      >
        {this.renderListForm()}
        {this.renderListEntry()}
        {this.renderFinish()}
      </Dialog>
    );
  }

  private onNavClick(listDialogStep: ListDialogStep) {
    this.setState({ listDialogStep });
  }

  private renderNavHeader() {
    const { listDialogStep, entries } = this.state;

    switch (listDialogStep) {
    case ListDialogStep.list:
      return <PanelHeader title="List" />;
    case ListDialogStep.entry:
      return (
        <PanelHeader
          title="Entry"
          prev={{ onClick: () => this.onNavClick(ListDialogStep.list), title: "List" }}
          next={{
            disabled: entries.length === 0,
            onClick: () => this.onNavClick(ListDialogStep.finish),
            title: "Finish",
          }}
        />
      );
    case ListDialogStep.finish:
      return (
        <PanelHeader
          title="Finish"
          prev={{ onClick: () => this.onNavClick(ListDialogStep.entry), title: "Entry" }}
        />
      );
    default:
      return;
    }
  }

  private renderNav() {
    return (
      <div className={Classes.PANEL_STACK_HEADER} style={{ marginBottom: "10px" }}>
        {this.renderNavHeader()}
      </div>
    );
  }

  private onListFormComplete(listName: string, listSlug: string) {
    const listDialogStep =
      this.state.entries.length === 0 ? ListDialogStep.entry : ListDialogStep.finish;
    this.setState({ listDialogStep, listName, listSlug });
  }

  private renderListForm() {
    const { defaultName, defaultSlug } = this.props;
    const { listDialogStep, listName, listSlug } = this.state;

    if (listDialogStep !== ListDialogStep.list) {
      return;
    }

    return (
      <ListFormFormContainer
        onComplete={(name: string, slug: string) => this.onListFormComplete(name, slug)}
        submitIcon="caret-right"
        submitText="Next"
        defaultName={listName || defaultName}
        defaultSlug={listSlug || defaultSlug}
      >
        {this.renderNav()}
      </ListFormFormContainer>
    );
  }

  private onCreateEntryFormComplete(v: IPricelistEntryJson, item: IShortItem) {
    const { entries, entriesItems } = this.state;

    this.setState({
      entries: [...entries, v],
      entriesItems: [...entriesItems, item],
      listDialogStep: ListDialogStep.finish,
    });
  }

  private onBulkEntryFormComplete() {
    this.setState({
      listDialogStep: ListDialogStep.finish,
    });
  }

  private onCreateEntryFormItemSelect(item: IShortItem) {
    const { entries } = this.state;

    for (const entry of entries) {
      if (entry.item_id === item.id) {
        this.setState({ entryFormError: "Item is already in the list." });

        return;
      }
    }

    this.setState({ entryFormError: "" });
  }

  private onBulkEntryFormItemSelect(item: IShortItem) {
    const { entries, entriesItems } = this.state;

    for (const entry of entries) {
      if (entry.item_id === item.id) {
        this.setState({ entryFormError: "Item is already in the list." });

        return;
      }
    }

    this.setState({
      entries: [...entries, { id: -1, item_id: item.id, quantity_modifier: 1 }],
      entriesItems: [...entriesItems, item],
      entryFormError: "",
    });
  }

  private renderSetToggle() {
    return (
      <Tooltip2 content="Switch to Pick Mode for faster entry">
        <Button icon="changes" onClick={() => this.setState({ entryMode: EntryMode.Pick })}>
          Pick Mode
        </Button>
      </Tooltip2>
    );
  }

  private renderPickToggle() {
    return (
      <Tooltip2 content="Switch to Set Mode for manually setting quantity">
        <Button icon="build" onClick={() => this.setState({ entryMode: EntryMode.Set })}>
          Set Mode
        </Button>
      </Tooltip2>
    );
  }

  private renderListEntry() {
    const { listDialogStep, entryFormError, entries, entryMode } = this.state;

    if (listDialogStep !== ListDialogStep.entry) {
      return;
    }

    const itemIdBlacklist: ItemId[] = entries.map(v => v.item_id);

    switch (entryMode) {
    case EntryMode.Set:
      return (
        <CreateEntryFormFormContainer
          onComplete={(v, item) => this.onCreateEntryFormComplete(v, item)}
          onItemSelect={v => this.onCreateEntryFormItemSelect(v)}
          externalItemError={entryFormError}
          itemIdBlacklist={itemIdBlacklist}
          leftChildren={this.renderSetToggle()}
        >
          {this.renderNav()}
        </CreateEntryFormFormContainer>
      );
    case EntryMode.Pick:
      return (
        <BulkEntryFormFormContainer
          onComplete={() => this.onBulkEntryFormComplete()}
          onItemSelect={v => this.onBulkEntryFormItemSelect(v)}
          externalItemError={entryFormError}
          itemIdBlacklist={itemIdBlacklist}
          leftChildren={this.renderPickToggle()}
          entriesTable={this.renderEntries()}
        >
          {this.renderNav()}
        </BulkEntryFormFormContainer>
      );
    default:
      return null;
    }
  }

  private removeEntryAtIndex(index: number) {
    const { entries } = this.state;

    this.setState({ entries: [...entries.slice(0, index), ...entries.slice(index + 1)] });
  }

  private getItem(id: ItemId): IShortItem | null {
    const { items } = this.props;
    const { entriesItems } = this.state;

    let foundItem = items.find(v => v.id === id);
    if (typeof foundItem !== "undefined") {
      return foundItem;
    }

    foundItem = entriesItems.find(v => v.id === id);
    if (typeof foundItem !== "undefined") {
      return foundItem;
    }

    return null;
  }

  private renderItemPopover(item: IShortItem | null) {
    if (item === null) {
      return;
    }

    return <ItemPopoverContainer item={item} />;
  }

  private renderEntry(index: number, entry: IPricelistEntryJson) {
    const item = this.getItem(entry.item_id);

    return (
      <tr key={index}>
        <td className={item === null ? "" : qualityToColorClass(item.quality.type)}>
          {this.renderItemPopover(item)}
        </td>
        <td>x{entry.quantity_modifier}</td>
        <td style={{ textAlign: "center" }}>
          <Button minimal={true} icon="delete" onClick={() => this.removeEntryAtIndex(index)} />
        </td>
      </tr>
    );
  }

  private onFinishClick() {
    const { listName: name, listSlug: slug, entries, entriesItems: items } = this.state;
    const { onComplete } = this.props;

    onComplete({ entries, name, slug, items });
  }

  private renderEntries() {
    const { entries } = this.state;

    const tableClassNames = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "list-dialog-table",
    ];

    if (entries.length > 0) {
      return (
        <div style={{ maxHeight: "300px", overflow: "auto" }}>
          <HTMLTable className={tableClassNames.join(" ")}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>{entries.map((v, i) => this.renderEntry(i, v))}</tbody>
          </HTMLTable>
        </div>
      );
    }

    return <ErrorList errors={{ entries: "There must be >1 entries." }} />;
  }

  private renderFinish() {
    const { listDialogStep, listName, entries } = this.state;
    const { mutatePricelistLevel, mutationErrors } = this.props;

    if (listDialogStep !== ListDialogStep.finish) {
      return;
    }

    return (
      <>
        <DialogBody>
          {this.renderNav()}
          {this.renderEntries()}
          <ErrorList errors={mutationErrors} />
        </DialogBody>
        <DialogActions>
          <Button
            text="Add More Entries"
            intent={Intent.NONE}
            onClick={() => this.setState({ listDialogStep: ListDialogStep.entry })}
            icon="caret-left"
          />
          <Button
            text={`Finish "${listName}"`}
            intent={Intent.PRIMARY}
            disabled={mutatePricelistLevel === FetchLevel.fetching || entries.length === 0}
            onClick={() => this.onFinishClick()}
            icon="edit"
          />
        </DialogActions>
      </>
    );
  }
}
