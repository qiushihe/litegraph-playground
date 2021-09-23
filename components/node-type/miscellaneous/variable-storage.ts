class VariableStorage {
  static defaultInstance: VariableStorage;

  static getDefaultInstance() {
    if (!VariableStorage.defaultInstance) {
      VariableStorage.defaultInstance = new VariableStorage();
    }
    return VariableStorage.defaultInstance;
  }

  values: Record<string, unknown>;

  constructor() {
    this.values = {};
  }

  getValue(key: string): unknown {
    return this.values[key];
  }

  setValue(key: string, value: unknown): void {
    this.values[key] = value;
  }
}

export default VariableStorage;
