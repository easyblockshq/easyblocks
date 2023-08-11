import { ComponentConfig } from "@easyblocks/core";
import { deepCompare } from "@easyblocks/utils";

export enum EditorHistoryAction {
  PUSH = "PUSH",
  REPLACE = "REPLACE",
  NONE = "NONE",
}

const HISTORY_SIZE = 50;

export interface HistoryEntry {
  focussedField: Array<string>;
  config: ComponentConfig;
  audiences: string[];
}

class EditorHistory {
  private values: HistoryEntry[];
  private currentIndex: number;

  constructor() {
    this.values = [];
    this.currentIndex = -1;
  }

  push(value: HistoryEntry) {
    const isCurrentIndexLastEntry =
      this.values.length - 1 === this.currentIndex;

    // If we push to history while `currentIndex` is not set on latest history entry
    // our history would me messed up. We need to rewrite our history by removing all
    // entries after the current index.
    if (!isCurrentIndexLastEntry) {
      this.values.splice(
        this.currentIndex + 1,
        this.values.length - 1 - this.currentIndex
      );
    }

    const isAboutToReachSizeLimit = this.values.length + 1 > HISTORY_SIZE;

    if (isAboutToReachSizeLimit) {
      this.values.shift();
    }

    this.values.push(value);
    this.currentIndex = this.values.length - 1;
  }

  replace(value: HistoryEntry) {
    this.values[this.currentIndex] = value;
  }

  replaceAt(oldValue: HistoryEntry, newValue: HistoryEntry) {
    const entryIndex = this.values.findIndex(
      (value) => value.config === oldValue.config
    );

    if (entryIndex !== -1) {
      this.values[entryIndex] = newValue;
    }
  }

  forward() {
    if (!this.canGoForward()) {
      this.currentIndex = this.values.length - 1;
      return null;
    }

    const currentEntry = this.values[this.currentIndex];

    while (this.canGoForward()) {
      this.currentIndex += 1;
      const nextEntry = this.values[this.currentIndex];

      if (!deepCompare(nextEntry.config, currentEntry.config)) {
        return nextEntry;
      }
    }

    return null;
  }

  back() {
    if (!this.canGoBack()) {
      return null;
    }

    const currentEntry = this.values[this.currentIndex];

    while (this.canGoBack()) {
      this.currentIndex -= 1;
      const previousEntry = this.values[this.currentIndex];

      if (!deepCompare(previousEntry.config, currentEntry.config)) {
        return previousEntry;
      }
    }

    return null;
  }

  getEntries(): Array<HistoryEntry> {
    return this.values.map((value) => ({
      ...value,
    }));
  }

  private canGoForward() {
    return this.currentIndex < this.values.length - 1;
  }

  private canGoBack() {
    return this.currentIndex > 0;
  }
}

export { EditorHistory };
