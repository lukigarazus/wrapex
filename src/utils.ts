import { Setter, Getter, ObjectToGettersAndSetters } from "./types";

export const isCapitalized = (str: string) => !!str.match(/^[A-Z].*$/);

export const uncapitalize = (str: string) =>
  typeof str === "string"
    ? str
      ? str[0].toLowerCase() + str.slice(1)
      : str
    : "";

export const capitalize = (str: string) =>
  typeof str === "string"
    ? str
      ? str[0].toUpperCase() + str.slice(1)
      : str
    : "";

export const getRelationSetterAndGetter = <
  Type,
  Key extends keyof Type,
  Model extends (init: { id: number | undefined }) => any
>({
  field,
  model,
  obj,
  required = false,
}: {
  field: Key;
  model: Model;
  obj: Type;
  required?: boolean;
}) => {
  type LocalReturnType = ObjectToGettersAndSetters<
    Pick<Type, Key>,
    ReturnType<Model>
  >;
  const capitalized = capitalize(field as string);
  const ctxKey = `model${capitalized}`;
  const getter: Getter<Type, ReturnType<Model>> = (obj, ctx) => {
    if (obj[field] !== null || required) {
      // return cached model
      if (ctx[ctxKey]) {
        return ctx[ctxKey];
      }

      const modelInstance = model({
        id: (obj[field] ?? undefined) as number | undefined,
      });
      if (modelInstance.id && modelInstance.populate) modelInstance.populate();
      ctx[ctxKey] = modelInstance;

      return modelInstance as ReturnType<Model> | null;
    }
    return null;
  };
  const setter: Setter<Type, ReturnType<Model>> = (obj, value, ctx) => {
    value = value as ReturnType<Model> | null;

    if (!value && required)
      throw new Error(`You can't remove a required field: ${field}`);

    obj[field] = value ? value.id : value;

    if (!value && ctx[ctxKey]) {
      delete ctx[ctxKey];
    } else {
      ctx[ctxKey] = value;
    }
    return true;
  };
  const res = {
    [`get${capitalized}`]: getter,
    [`set${capitalized}`]: setter,
  } as ObjectToGettersAndSetters<Pick<Type, Key>, ReturnType<Model>>;
  return res;
};
