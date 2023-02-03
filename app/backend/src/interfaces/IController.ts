export interface IcontrollerReader<T> {
  getAll(): T[];
  getById(id: number): T;
}

export interface IcontroolerWriter<T> {
  create(): T;
  update(): T;
  delete(): void;
}

export default interface Icontroller<T> extends IcontrollerReader<T>, IcontroolerWriter<T> {}
