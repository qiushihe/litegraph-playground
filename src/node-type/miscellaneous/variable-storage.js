class VariableStorage {
  static defaultInstance;

  static getDefaultInstance() {
    if (!VariableStorage.defaultInstance) {
      VariableStorage.defaultInstance = new VariableStorage();
    }
    return VariableStorage.defaultInstance;
  }

  constructor() {
    this.values = {};
  }

  getValue(key) {
    return this.values[key];
  }

  setValue(key, value) {
    this.values[key] = value;
  }
}

export default VariableStorage;
