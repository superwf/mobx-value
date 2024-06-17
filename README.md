# Mobx Value

<img width="50" src="https://raw.githubusercontent.com/superwf/mobx-value/master/mobx-value-logo.svg" />

`mobx-value` is a simple and small data management lib, with it data decouple from component.

The most outstanding of `mobx-value` is, you do not have to create much structure layer code, as `reducer` or `action` or `dispatch`.

- [MobxValue](#mobx-value)
  - [Overview](#overview)
  - [Installation](#installation)
  - [API](#api)
    - [Setter](#setter)
    - [Boolean](#boolean)
    - [Request](#request)
    - [Lazy](#lazy)
    - [Alias](#alias)
    - [SetMobx](#setmobx)
  - [Example](#example)
    - [Work with React](#work-with-react)
    - [Hooks](#hooks)
  - [CDN](#cdn)
  - [Build doc](#build-doc)
  - [TODO](#todo)

## Overview

If you feel redux(or other libs similar to redux) is reduant, and have strong need of data management out of component. Try this one.

By `mobx-value`, just create a data by `setter`(or request or boolean or lazy), use it in a component, wrap the component with `observer` from `mobx-react-lite`, it works.

Note: `mobx-value` only works with `Mobx` > 6.0.0.

![Statements](https://raw.githubusercontent.com/superwf/mobx-value/master/badge/badge-statements.svg)

![Branches](https://raw.githubusercontent.com/superwf/mobx-value/master/badge/badge-branches.svg)

![Functions](https://raw.githubusercontent.com/superwf/mobx-value/master/badge/badge-functions.svg)

![Lines](https://github.com/superwf/mobx-value/raw/master/badge/badge-lines.svg)

## Installation

```sh
npm install -S mobx mobx-value
// or yarn
yarn add mobx mobx-value
```

## Api

### setter

- Example

```typescript
import { setter } from 'mobx-value'

const counter = setter({ value: 1 })
counter.value // 1
counter.set(2)
counter.value // 2
counter.set(n => n + 1) // support function from version 1.5
counter.value // 3
counter.restore()
counter.value // 1

const o = setter({
  value: {n: 1},
})
o.merge({ m: 2 }) // add `merge` method from version 1.7
o.value // { n: 1, m: 2 }
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

  /**
   * alias of `autoRestoreOnBecomeUnobserved`
   * @default false
   * added version 1.8.0
   * */
  autoRestore?: boolean

  /**
   * mobx debug name
   * */
   name?: string // support from version 1.6
}
```

- Return type `MobxSetterValue`

```typescript
interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data | ((current: Data) => Data)) => void
  restore: () => void
  /** only works when value is an object, shallow merge properties */
  merge: (v: Record<string, any>) => void
}
```

### boolean

Extends from setter, is a specifically for bool value.

- Example

```typescript
import { boolean } from 'mobx-value'

const modal = boolean()
modal.value // false
modal.setTrue() // true
modal.setFalse // false
modal.toggle() // true
modal.restore() // false
```

- Parameters type `MobxBooleanOption`

```typescript
interface MobxBooleanOption {
  /**
    * @default false
    */
  value?: boolean,

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * alias of `autoRestoreOnBecomeUnobserved`
   * @default false
   * added version 1.8.0
   * */
  autoRestore?: boolean

  /**
   * mobx debug name
   * */
   name?: string
}
```

- Return type `MobxBooleanValue`

```typescript
interface MobxBooleanValue {
  value: boolean
  set: (v: boolean | ((current: boolean) => boolean)) => void
  restore: () => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}
```

### request

Extends from setter, all setter properties are available.

- Example

```typescript
import { request } from 'mobx-value'

const user = request({
  value: { name: '' },
  request: () => Promise.resolve({ name: 'abc' }),
})

user.value.name // ''
user.loading // false
await user.request() // when requesting, user.loading is true
user.loading // false
user.value.name // 'abc'
user.restore()
user.value.name // ''

user.request()
user.cancel() // cancel last request

// only request once
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

  /**
    * set to true, prevent next request when loading, default false
    */
  parallel?: boolean

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * alias of `autoRestoreOnBecomeUnobserved`
   * @default false
   * added version 1.8.0
   * */
  autoRestore?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean

  /**
   * mobx debug name
   * */
   name?: string
}
```

- Return type `MobxRequestValue`

```typescript
interface MobxRequestValue<Data, Request extends (args?: any) => Promise<Data>> {
  value: Data
  set: (v: Data | ((current: Data) => Data)) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  // cancel request only when loading status
  cancel: () => void
  loading: boolean
  /**
    * request again with last parameters
    */
  refresh: () => CancellablePromise<Data>
  /** get last call args */
  getLastArgs: () => any[]
}
```

### lazy

extends from `request`, all `request` properties are available.

- Example

```typescript
import { lazy } from 'mobx-value'

const user = lazy({ value: { name: '' }, request: () => Promise.resolve({ name: 'abc' })})

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
   * request default prevent next request when last request is loading
   * set to true to allow next request when loading
   * @default false
   * */
  parallel?: boolean

  /**
   * auto run restore when leave observer context
   * @default false
   * */
  autoRestoreOnBecomeUnobserved?: boolean

  /**
   * alias of `autoRestoreOnBecomeUnobserved`
   * @default false
   * added version 1.8.0
   * */
  autoRestore?: boolean

  /**
   * auto cancle request when not observed and loading is not complete
   * @default false
   * */
  autoCancelOnBecomeUnobserved?: boolean

  /**
   * mobx debug name
   * */
   name?: string
}
```

- Return type `MobxLazyValue`

```typescript
interface MobxLazyValue<Data, Request extends RequestFunction> {
  value: Data
  set: (v: Data | ((current: Data) => Data)) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel: () => void
  loading: boolean

  /**
   * status tag, do not modify it
   * @readonly
   */
  requested: boolean
  cancel(): void

  /**
   * last request ready promise
   * when need some operate after this data is loaded
   * use `await lazy.ready`
   * * */
  ready: Promise<Data>
  refresh(): void

  /**
   * restore value also reset all request status to initial
   * when next time it enter mobx observer context
   * it will request again
   * */
  reset(): void
}
```

### Alias

At early version, the export method is `mobxSetter`, `mobxBoolean`, `mobxRequest` and `mobxLazy`.

From v1.1, add short alias `setter`, `boolean`, `request` and `lazy`.

### setMobx

From v1.4.2, add `setMobx` to set `mobx` instance for `mobx-value`.

When there are more than one mobx instances work togather. Use this can manually set which should be used by `mobx-value`.

```typescript
import * as otherVersionMobx from 'mobx-v60'
import { setMobx } from 'mobx-value'

setMobx(otherVersionMobx)

```

## Example

A good example is a better doc.

This repo source code also includes examples.

Play it with the following steps.

```sh
git clone https://github.com/superwf/mobx-value.git
cd mobx-value
yarn
yarn start
```

### Work with React

To work with React, use `observer` in `mobx-react-lite` with React component.

```typescript
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { render } from 'react-dom'
import { setter } from 'mobx-value'

const counter = setter({
  value: 1,
})

export const Example: FC = observer(() => (
  <div>
    Counter: {counter.value}
    <button type="primary" onClick={() => counter.set(counter.value + 1)}>
      Counter ++
    </button>
  </div>
))

render(<Example />, document.querySelector('#app'))
```

### Hooks

Use `useMobxValue` instead wrap component with `observer`.

```typescript
import type { FC } from 'react'
import { render } from 'react-dom'
import { setter, useMobxValue } from 'mobx-value'

const counter = setter({
  value: 1,
})

export const Example: FC = () => {
  const n = useMobxValue(counter)
  return <div>
    Counter: {n}
    <button type="primary" onClick={() => counter.set(counter.value + 1)}>
      Counter ++
    </button>
  </div>
}

render(<Example />, document.querySelector('#app'))
```

## CDN

- Use `mobx-value` by from cdn, Global variable name is `window.mobxValue`

`<script type="javascript" src="https://unpkg.com/mobx-value/dist/index.js"></script>`

## Build doc

[BUILD.md](./BUILD.md)

## TODO

Something to be inproved in future.

- [] add delay time for loading debounce.
