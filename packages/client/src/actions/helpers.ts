export interface IAction<T extends string> {
  type: T;
}

export interface IActionWithPayload<T extends string, P> extends IAction<T> {
  payload: P;
}

export function createAction<T extends string>(type: T): IAction<T>;
export function createAction<T extends string, P>(type: T, payload: P): IActionWithPayload<T, P>;
export function createAction<T extends string, P>(
  type: T,
  payload?: P,
): IAction<T> | IActionWithPayload<T, P> {
  return payload === undefined ? { type } : { type, payload };
}

type FunctionType = (...args: any[]) => any;
interface IActionCreatorsMapObject {
  [actionCreator: string]: FunctionType;
}
export type ActionsUnion<A extends IActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export function sleep(duration: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, duration));
}
