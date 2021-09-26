# Mobx Value

- [MobxValue](#mobx-value)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Example](#example)
  - [CDN](#cdn)
  - [API](#api)
    - [mobxSetter](#mobxsetter)
    - [mobxBoolean](#mobxboolean)
    - [mobxRequest](#mobxrequest)
    - [mobxLazy](#mobxlazy)

## Overview

Like `mobx-utils`, this lib is a `mobx` tool set.

Work with Mobx V6.

![Statements](./badge/badge-statements.svg)

![Branches](./badge/badge-branches.svg)

![Functions](./badge/badge-functions.svg)

![Lines](./badge/badge-lines.svg)

## Installation

```sh
npm install -S mobx mobx-value
// or yarn
yarn add mobx mobx-value
```

## Example

A good example is a better doc.

Play it with the following steps.

```sh
git clone https://github.com/superwf/mobx-value.git
cd mobx-value
yarn
yarn start
```

## CDN

- Global var mode mode. Global variable name: `window.mobxValue`

`<script type="javascript" src="https://unpkg.com/mobx-value/dist/index.js"></script>`

## Api

To work with React, use `observer` in `mobx-react-lite` with React component.

### mobxSetter

- Example

```typescript
const counter = mobxSetter({ value: 1 })
counter.value // 1
counter.set(2)
counter.value // 2
counter.restore()
counter.value // 1
```

- Parameters type `MobxSetterOption`

```typescript
interface MobxSetterOption<Data> {
  value: Data,

  /**
   * mobx `makeObservable` annotation option for `value`
   * @default observable
   * */
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean
}
```

- Return type `MobxSetterValue`

```typescript
interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}
```

### mobxBoolean

extends from mobxSetter, is a specifically for boolean type.

- Example

```typescript
const modal = mobxBoolean()
modal.value // false
modal.setTrue() // true
modal.setFalse // false
modal.toggle() // true
modal.restore() // false
```

- Parameters type `MobxBooleanOption`

```typescript
interface MobxBooleanOption {
  // @default false
  value?: boolean,

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean
}
```

- Return type `MobxBooleanValue`

```typescript
interface MobxBooleanValue {
  value: boolean
  set: (v: boolean) => void
  restore: () => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}
```

### mobxRequest

extends from mobxSetter, all mobxSetter properties are available.

- Example

```typescript
const user = mobxRequest({ value: { name: '' }, request: () => Promise.resolve({ name: 'abc' }) })

user.value.name // ''
user.loading // false
await user.request() // when requesting, user.loading is true
user.loading // false
user.value.name // 'abc'
user.restore()
user.value.name // ''

user.request()
user.cancel() // cancel last request

/** only request once */
user.request() // auto debounce
user.request() // when last request not complete
user.request() // new request will be debounced
```

- Parameters type `MobxRequestOption`

```typescript
interface MobxRequestOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>
  // set to true, prevent next request when loading, default false
  parallel?: boolean

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean
}
```

- Return type `MobxRequestValue`

```typescript
interface MobxRequestValue<Data, Request extends (args?: any) => Promise<Data>> {
  value: Data
  set: (v: Data) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  // cancel request only when loading status
  cancel: () => void
  loading: boolean
  /** request again with last parameters */
  refresh: () => CancellablePromise<Data>
}
```

### mobxLazy

extends from mobxRequest, all mobxRequest properties are available.

- Example

```typescript
const user = mobxLazy({ value: { name: '' }, request: () => Promise.resolve({ name: 'abc' })})

// Notice，the lazy value must be in observer context, such as autorun, reaction
// outside observer context, use lazy value will not trigger request
autorun(() => {
  console.log(user.value.name)
})

user.loading // default false, true when requesting data
user.restore()
user.value.name // ''
```

- Parameters type `MobxLazyOption`, same with `MobxRequestOption`

```typescript
interface MobxLazyOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>

  /**
   * set to true, prevent next request when loading
   * @default false
   * */
  parallel?: boolean

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean
}
```

- Return type `MobxLazyValue`

```typescript
interface MobxLazyValue<Data, Request extends RequestFunction> {
  value: Data
  set: (v: Data) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel: () => void
  loading: boolean

  /** @readonly */
  requested: boolean
  cancel(): void
  ready: Promise<Data>
  refresh(): void

  /**
   * restore and reset request to initial status
   */
  reset(): void
}
```
