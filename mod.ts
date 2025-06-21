import type { StandardSchemaV1 } from "jsr:@standard-schema/spec";

// Struct fields can be either named or tuple.
export type StructNamedFields = Record<
  Exclude<string | symbol, "~standard">,
  StandardSchemaV1
>;
export type StructUnitFields = null | undefined;
export type StructSingleFields = StandardSchemaV1;
export type StructTupleFields = StandardSchemaV1[];
export type StructCustomFields = StandardSchemaV1<
  unknown[],
  Record<string | symbol, unknown>
>;
export type StructFields =
  | StructNamedFields
  | StructTupleFields
  | StructSingleFields
  | StructUnitFields;

type TryInferInput<T> = T extends StandardSchemaV1
  ? StandardSchemaV1.InferInput<T>
  : never;

type TryInferOutput<T> = T extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<T>
  : never;

export type StructInput<SF extends StructFields> =
  // null
  SF extends null ? []
    // single
    : SF extends StandardSchemaV1 ? [TryInferInput<SF>]
    // tuple
    : SF extends unknown[] ? { [K in keyof SF]: TryInferInput<SF[K]> }
    // named
    : [{ [K in keyof SF]: TryInferInput<SF[K]> }];

export type StructOutput<SF extends StructFields> =
  // null
  SF extends null ? Record<PropertyKey, never>
    // single
    : SF extends StandardSchemaV1 ? { "0": TryInferOutput<SF> }
    // tuple
    : SF extends unknown[]
      ? { [K in keyof SF as K & `${number}`]: TryInferOutput<SF[K]> }
    // named
    : { [K in keyof SF]: TryInferOutput<SF[K]> };

export type Struct<SF extends StructFields> = {
  /** factory */
  (...args: StructInput<SF>): StructOutput<SF>;
  /** constructor */
  new (...args: StructInput<SF>): StructOutput<SF>;
};

export function Struct<const SF extends StructFields>(
  fields?: SF,
  init?: string | { name?: string },
  // TODO: allow methods using ThisType
  // TODO: allow extends
  // methods: any
): Struct<SF> {
  const name = typeof init == "string" ? init : init?.name ?? "";

  const struct = function (
    this: StructOutput<SF> | undefined,
    ...args: StructInput<SF>
  ) {
    // if factory, return constructor
    if (!(this instanceof struct)) return new struct(...args);

    // set fields
    if (fields == null) { // null
      // pass
    } else if ("~standard" in fields) { // single
      const validated = (fields as StructSingleFields)["~standard"]
        .validate(args[0]);
      if (validated instanceof Promise) {
        throw new TypeError("schema validation must be sync");
      }
      // TODO: wrap issues
      if (validated.issues) throw validated.issues;
      // deno-lint-ignore no-explicit-any
      (this as any)[0] = validated.value;
    } else if (Array.isArray(fields)) { // tuple
      for (const [i, schema] of fields.entries()) {
        const validated = schema["~standard"].validate(args[i]);
        if (validated instanceof Promise) {
          throw new TypeError("schema validation must be sync");
        }
        // TODO: wrap issues
        if (validated.issues) throw validated.issues;
        // deno-lint-ignore no-explicit-any
        (this as any)[i] = validated.value;
      }
    } else { // named
      // deno-lint-ignore no-explicit-any
      const namedArgs = args[0] as any;
      for (const [fieldName, schema] of Object.entries(fields)) {
        const validated = schema["~standard"].validate(namedArgs[fieldName]);
        if (validated instanceof Promise) {
          throw new TypeError("schema validation must be sync");
        }
        // TODO: wrap issues
        if (validated.issues) throw validated.issues;
        // deno-lint-ignore no-explicit-any
        (this as any)[fieldName] = validated.value;
      }
    }

    return this;
  } as Struct<SF>;

  // change to provided class name
  Object.defineProperty(struct, "name", { value: name });

  // TODO: define methods
  // constructor.prototype.greet = function () {
  //   console.log("Hello world");
  // };

  return struct;
}

export type Enum<SS extends Record<string, StructFields>> = {
  [K in keyof SS]: Struct<SS[K]>;
};

export function Enum<SS extends Record<string, StructFields>>(
  ss: SS,
  init?: string | { name?: string },
): Enum<SS> {
  const name = typeof init == "string" ? init : init?.name ?? "";

  return Object.fromEntries(
    Object.entries(ss).map(function ([key, schema]) {
      return [key, Struct(schema, { name: `${name}.${key}` })];
    }),
  ) as unknown as Enum<SS>;
}
