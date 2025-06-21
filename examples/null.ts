import { type } from "npm:arktype";
import { Enum, Struct } from "../mod.ts";

const Keys = Enum({
  Backspace: null,
  BackTab: null,
  F: [type.number],
});
const key = Keys.BackTab();
console.log({ key, instance: key instanceof Keys.BackTab });

const Tag = Struct();
const tag = Tag();
console.log({ tag, instance: tag instanceof Tag });
