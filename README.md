
# Rusty Types

> [!NOTE]
> This project is still a work in progress.

This package help you create Rust flavored datatypes in TypeScript.

## Usage

> [!NOTE]
> Currently rusty-types is not published to JSR.
> You can import it with JSDelivr.

Two foundamental exports from `rusty-types` is `Struct` and `Enum`.

`rusty-types` use [`standard-schema`](https://github.com/standard-schema/standard-schema) in its interface,
so you can use [Zod](https://zod.dev/), [Valibot](https://valibot.dev/), [Arktype](https://arktype.io/)
or any other validator to your best fits.

<table>
<thead>
<tr>
<th>Case</th>
<th>Rust</th>
<th>rusty-types</th>
</tr>
</thead>
<tbody>

<tr>
<td>Named struct</td>
<td>

```rust
struct Person {
  name: String,
  age: usize,
}

let person = Person {
  name: "Alice".into(),
  age: 20
};
```

</td>
<td>

```typescript
const Person = Struct("Person", {
  name: z.string(),
  age: z.number(),
});

const alice = new Person({
  name: "Alice",
  age: 20
});
const bob = Person({
  name: "Bob",
  age: 22
});
```

</td>
</tr>

<tr>
<td>Tuple struct</td>
<td>

```rust
struct Vec3(f32, f32, f32);

let vec = Vec3(1., 2., 3.);
```

</td>
<td>

```typescript
const Vec3 = Struct("Vec3", [
  z.number(),
  z.number(),
  z.number(),
]);

const vec_1 = new Vec3(1, 2, 3);
const vec_2 = Vec3(4, 5, 6);
```

</td>
</tr>

<tr>
<td>Enum</td>
<td>

```rust
enum Event {
  Key { code: usize },
  Mouse {
    state: usize,
    button: usize,
  },
  Paste(String),
}

let event_1 = Event::Key {
  code: 123
};
let event_2 = Event::Mouse {
  button: 123,
  state: 0,
};
let event_3 = Event::Paste(
  "some text".into()
);
```

</td>
<td>

```typescript
const Event = Enum(
  {
    Key: { code: z.number() },
    Mouse: {
      state: z.number(),
      button: z.number()
    },
    Paste: [z.string()],
  } as const,
);

const event_1 = Event.Key({
  code: 123
});
const event_2 = new Event.Mouse({
  button: 123,
  state: 0
});
const event_3 = new Event.Paste(
  "some text"
);
```

</td>
</tr>

</tbody>
</table>

## Roadmap

- [ ] custom transform
- [ ] methods
- [ ] extends
- [ ] auto JS-lize(e.g. `get_name()` -> `get name()`)

