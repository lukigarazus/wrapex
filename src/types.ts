export type ReturnTypo<T> = T & {
  snapshot: any;
  disposed: boolean;
  dispose: () => void;
  updateable: boolean;
  disableUpdates: () => void;
  enableUpdates: () => void;
  addObservableKey: (key: string, value: any) => void;
  clone: () => ReturnTypo<T>;
  getCtx: () => { [key: string]: any };
};

// --------------------------------------------------------------------

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type RequiredKeys<T> = Exclude<
  KeysOfType<T, Exclude<T[keyof T], undefined>>,
  undefined
>;

// ---------------------------------------------------------------------

export type KeyToGetter<T> = T extends string ? `get${Capitalize<T>}` : never;

export type KeyFromGetter<T> = T extends `get${infer rest}`
  ? Uncapitalize<rest>
  : never;

export type KeyToSetter<T> = T extends string ? `set${Capitalize<T>}` : never;

export type KeyFromSetter<T> = T extends `set${infer rest}`
  ? Uncapitalize<rest>
  : never;

export type KeyToSetterAndGetter<T> = KeyToGetter<T> | KeyToSetter<T>;

export type KeyFromSetterAndGetter<T> = KeyFromGetter<T> | KeyFromSetter<T>;

export type GettersFromUnion<T> = T extends `get${infer rest}` ? T : never;

export type SettersFromUnion<T> = T extends `set${infer rest}` ? T : never;
// ---------------------------------------------------------------------

export type ObjectFromGetters<T extends { [key: string]: any }> = {
  [key in KeyFromSetterAndGetter<keyof T>]: ReturnType<T[KeyToGetter<key>]>;
};

export type Getter<T, R> = (obj: ReturnTypo<T>, ctx: any) => R | null;

export type Setter<T, R> = (
  obj: ReturnTypo<T>,
  value: R | null,
  ctx: any
) => boolean;

export type ObjectToGetters<T, R> = {
  [key in KeyToGetter<keyof T>]: Getter<T, R>;
};

export type ObjectToSetters<T, R> = {
  [key in KeyToSetter<keyof T>]: Setter<T, R>;
};

export type ObjectToGettersAndSetters<T, R = any> = ObjectToGetters<T, R> &
  ObjectToSetters<T, R>;

export type GettersType<T> = T[Extract<keyof T, GettersFromUnion<keyof T>>];

export type SettersType<T> = T[Extract<keyof T, SettersFromUnion<keyof T>>];

// -------------------------------------------------

export interface InitialArguments<Type, Keys, Modifier> {
  fields: Keys;
  init: Type;
  modifier?: Modifier;
  excludeFieldsFromUpdate?: Keys;
  typename: string;
  checkFields?: Keys;
  foreignFieldsMapping?: Partial<{ [key in keyof Type]: keyof Type }>;
}

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

export type SafeFirstParameter<
  T extends (...args: any) => any
> = Parameters<T>[0] extends undefined ? {} : Parameters<T>[0];

export type LeftPrecedenceUnion<L, R> = L & Omit<R, keyof L>;
