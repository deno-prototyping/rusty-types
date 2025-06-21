import { type } from "npm:arktype";
import { Enum, Struct } from "../mod.ts";

const Keys = Enum({
  Backspace: null,
  BackTab: null,
  F: type.number,
});
const key = Keys.F(123);
console.log({ key, instance: key instanceof Keys.F });

const NewType = Struct(type.string);
const x = NewType("Hello");
console.log({ x, instance: x instanceof NewType });
