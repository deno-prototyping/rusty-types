import { z } from "npm:zod";
import { Enum, Struct } from "../mod.ts";

// named struct
const Person = Struct({
  name: z.string(),
  age: z.number(),
}, "Person");

const alice = new Person({ name: "Alice", age: 10 });
const bob = Person({ name: "Bob", age: 20 });
console.log({ alice, bob });

// tuple struct
const Vec3 = Struct([
  z.number(),
  z.number(),
  z.number(),
], "Vec3");

const vec_1 = new Vec3(1, 2, 3);
const vec_2 = Vec3(4, 5, 6);
console.log({ vec_1, vec_2 });

// enum
const Event = Enum({
  Key: { code: z.number() },
  Mouse: { state: z.number(), button: z.number() },
  Paste: [z.string()] as const,
}, "Event");

const event_1 = Event.Key({ code: 123 });
const event_2 = new Event.Mouse({ button: 123, state: 0 });
const event_3 = new Event.Paste("foo");
console.log({ event_1, event_2, event_3 });
