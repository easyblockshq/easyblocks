export interface Entry {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  page?: any;
}

const TEN_DAYS_IN_SECONDS = 10 * 24 * 60 * 60 * 1000;

export class MockDataService {
  private readonly storageKey = "entries";
  private readonly mockEntries: Entry[] = [
    {
      id: "84b180c9-4a47-4ecf-bc59-21c2069060e3",
      name: "Mock Entry 1",
      description: "This is a mock entry",
      createdAt: new Date(new Date().getTime() - 2 * TEN_DAYS_IN_SECONDS),
      updatedAt: new Date(new Date().getTime() - 2 * TEN_DAYS_IN_SECONDS),
    },
    {
      id: "d9b657e3-2b17-47ae-8450-3d7f1ce47ce3",
      name: "Mock Entry 2",
      description: "This is another mock entry",
      createdAt: new Date(new Date().getTime() - TEN_DAYS_IN_SECONDS),
      updatedAt: new Date(new Date().getTime() - TEN_DAYS_IN_SECONDS),
    },
    {
      id: "b85bb2dc-9769-44b7-ac53-93e0ca9134eb",
      name: "Mock Entry 3",
      description: "This is yet another mock entry",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.mockEntries));
    }
  }

  public getEntries(): Entry[] {
    const entriesString = localStorage.getItem(this.storageKey);
    if (entriesString === null) {
      throw new Error("unreachable");
    }
    return JSON.parse(entriesString).map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  }

  public getEntryById(id: string): Entry | undefined {
    const entries = this.getEntries();
    return entries.find((entry) => entry.id === id);
  }

  public addEntry(entry: Entry) {
    const currentEntries = this.getEntries();
    if (currentEntries) {
      currentEntries.push(entry);
      localStorage.setItem(this.storageKey, JSON.stringify(currentEntries));
    }
  }

  public updateEntry(entry: Entry) {
    let entries = this.getEntries();
    if (entries) {
      entries = entries.map((e) => {
        if (e.id === entry.id) {
          return entry;
        }
        return e;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
  }
}
