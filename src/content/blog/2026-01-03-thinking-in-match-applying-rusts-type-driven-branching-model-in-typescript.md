---

title: "Thinking in match: Applying Rust’s Type-Driven Branching Model in TypeScript" 
pubDate: "Jan 03 2026"
description: ""
heroImage: https://images.unsplash.com/photo-1766369849724-a3fad7e199a7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
category: typescript, rust
---


One of the most impactful ideas I took from working with Rust has nothing to do with ownership or lifetimes. It has to do with how the language forces you to think about conditional logic.

Rust’s `match` is often described as a more expressive `switch`, but that framing undersells what it really provides. At its core, `match` is a design tool. It pushes developers to model decisions around explicit states, to make branching exhaustive by construction, and to let the type system participate directly in control flow decisions. Over time, this way of thinking started to influence how I reason about conditional logic even when I am not writing Rust.

This article is a reflection on that mental shift. It does not claim that TypeScript has a native equivalent to Rust’s `match`. Instead, it explores how the same conceptual model can be applied intentionally using TypeScript’s type system, where that analogy holds, and where it intentionally breaks.

## A personal note

Earlier this week, during one of my code reviews, I caught myself making a comparison that tends to resurface from time to time. I was reviewing some conditional logic and thinking about how much better structured it could be if it were organized around explicit states rather than scattered `if` statements.

My first instinct was to think in terms of enums. Not enums as simple constants, but enums as a way to encode a closed set of valid states and make branching decisions explicit. That is a pattern that becomes second nature after spending time with Rust.

TypeScript does offer `enum`, but they behave very differently from enums in Rust. TypeScript enums exist at runtime and compile down to JavaScript objects. They are not type-only constructs, they introduce runtime artifacts, and they do not provide the same guarantees around exhaustiveness and immutability. In practice, this makes them closer to a namespaced set of constants than to a true modeling tool.

Because of that, I tend to favor union types combined with `as const` objects. This approach keeps state modeling firmly in the type system, avoids unnecessary runtime behavior, and integrates naturally with exhaustiveness checks. It also aligns much more closely with the way Rust encourages you to think about branching logic. That recurring observation during the review is what ultimately led me to organize these notes into a more structured reflection.

## What `match` actually solves in Rust

To understand why this model matters, it helps to be precise about what `match` solves in Rust. At a glance, it looks like a cleaner way to branch on values, but its real value is in how it eliminates entire classes of invalid states.

```rust
enum Environment {
    Local,
    Staging,
    Production,
}

fn base_url(env: Environment) -> &'static str {
    match env {
        Environment::Local => "http://localhost",
        Environment::Staging => "https://staging.api.com",
        Environment::Production => "https://api.com",
    }
}
```

Every possible variant of `Environment` is handled explicitly. There is no implicit fallback, no default branch silently catching unexpected values, and no way to forget a case without the compiler forcing you to address it. If a new variant is added, the code stops compiling until the branching logic is updated accordingly. The return value is always valid because invalid states cannot be expressed.

This is type-driven branching. The type system is not just validating data, it is shaping control flow.

## Why conditional logic often degrades in TypeScript

In TypeScript, conditional logic often starts small and grows organically. A function begins with a couple of `if` statements, a default return is added, and over time the logic becomes harder to reason about.

```ts
function getBaseUrl(env: string) {
  if (env === 'local') return 'http://localhost';
  if (env === 'staging') return 'https://staging.api.com';

  return 'https://api.com';
}
```

This code accepts invalid inputs, relies on implicit fallbacks, and does not force existing logic to change when new states are introduced. The type system is largely absent from the decision-making process, and errors tend to surface only at runtime. The issue here is not syntax, but the absence of explicit state modeling.

## Applying the `match` mental model in TypeScript

TypeScript does not provide a native `match` expression, but it does provide the necessary building blocks to recreate many of the same guarantees when used deliberately. The key shift is moving away from control-flow-driven logic and toward data- and type-driven logic.

For simple mappings, `Record` provides a strong foundation.

```ts
type Environment = 'local' | 'staging' | 'production';

const baseUrlByEnv: Record<Environment, string> = {
  local: 'http://localhost',
  staging: 'https://staging.api.com',
  production: 'https://api.com',
};

export function getBaseUrl(env: Environment) {
  return baseUrlByEnv[env];
}
```

The mapping is exhaustive by construction. Missing cases are caught at compile time, the intent is declarative, and there is no fallback logic hiding unexpected states.

When the branching logic becomes more complex, a `switch` combined with an explicit exhaustiveness check using `never` restores many of the same properties.

```ts
type Environment = 'local' | 'staging' | 'production';

export function getBaseUrl(env: Environment): string {
  switch (env) {
    case 'local':
      return 'http://localhost';
    case 'staging':
      return 'https://staging.api.com';
    case 'production':
      return 'https://api.com';
    default: {
      const exhaustiveCheck: never = env;
      return exhaustiveCheck;
    }
  }
}
```

If a new environment is introduced and not handled, TypeScript fails the build. This is a deliberate choice to make invalid states unrepresentable in the branching logic.

## Discriminated unions as the real parallel to Rust enums

The strongest parallel to Rust enums in TypeScript is not `enum`, but discriminated unions. They allow you to encode both state and associated data in a way that naturally supports exhaustive branching.

```ts
type Result =
  | { type: 'ok'; value: number }
  | { type: 'error'; error: string };

function handleResult(result: Result) {
  switch (result.type) {
    case 'ok':
      return result.value;
    case 'error':
      throw new Error(result.error);
    default: {
      const unreachable: never = result;
      return unreachable;
    }
  }
}
```

The syntax differs from Rust, but the mental model is the same. You are forced to consider all valid states and prevented from silently ignoring new ones.

## Performance and organizational trade-offs

It is natural to ask whether this approach provides measurable performance gains. In practice, the answer is no. Object lookups via `Record` and `switch` statements are both heavily optimized by modern JavaScript engines. The differences are negligible for typical application logic and should not be the deciding factor.

Where the approach provides real value is in organization and maintainability. Modeling explicit states reduces the surface area for bugs, removes implicit fallbacks, and makes the impact of change visible at compile time. When a new state is introduced, the compiler highlights exactly where logic must be updated. In large codebases, this feedback loop is invaluable.

There are also important counterpoints. For simple or highly dynamic domains, this style can become overengineering. It introduces additional type-level complexity, increases cognitive load for less experienced teams, and can create a false sense of security if runtime validation is neglected. TypeScript is not sound, and these patterns do not replace proper input validation.

As with most design decisions, the value lies in calibration. This model works best when the domain has a closed set of states, when business rules evolve over time, and when long-term maintainability outweighs short-term convenience.

## Where the analogy intentionally breaks

This comparison is conceptual rather than literal. Rust enforces its guarantees at runtime and offers native pattern matching over complex data structures. TypeScript approximates similar behavior through composition of simpler constructs and can only enforce correctness at compile time.

These differences matter. The goal is not to pretend the languages offer the same guarantees, but to apply proven design principles where they fit.

## Closing thoughts

Working with Rust changed how I think about conditional logic, even when writing TypeScript. By leaning into explicit state modeling, exhaustive branching, and type-driven decisions, I have found my code to be more predictable and easier to evolve.

Good ideas travel well across languages. The `match` mindset is one of them, and TypeScript provides enough expressive power to apply it deliberately when the domain calls for it.

