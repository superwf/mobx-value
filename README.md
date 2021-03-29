# Mobx eazy usage encapsulation

Inspired by `mobx-utils`，but `mobx-utils` can not work with my project case properly, then `mobx-value` born.

Based on Mobx 6.

## Four mobx value type

### setter

* Example

```typescript
const a = mobxSetter({ value: 1 })
a.value // 1
a.set(2)
a.value // 2
a.restore()
a.value // 1
```

* Parameters type `MobxSetterOption`

```typescript
interface MobxSetterOption<Data> {
  value: Data,
  // 参考mobx文档，默认为observable，true与observable相同，其他选项按需配置
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
}
```

* Return type `MobxSetterValue`

```typescript
interface MobxSetterValue<Data> {
  value: Data
  set: (v: Data) => void
  restore: () => void
}
```

### boolean, based on setter

* Example

```typescript
const a = mobxBoolean()
a.value // false
a.setTrue() // true
a.setFalse // false
a.toggle() // true
a.restore() // false
```

* Parameters type `boolean`, optional, default `false`.

* Return type `MobxBooleanValue`

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

### request, based on setter

* Example

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
```

* Parameters type `MobxRequestOption`

```typescript
interface MobxRequestOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>
}
```

* Return type `MobxRequestValue`

```typescript
interface MobxRequestValue<Data, Request extends (args?: any) => Promise<Data>> {
  value: Data
  set: (v: Data) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel: () => void
  loading: boolean
}
```

### lazy, based on request

* Example

```typescript
const user = mobxLazy({ value: { name: '' }, request: () => Promise.resolve({ name: 'abc' })})

// run twice, first time is '', second time is 'abc'
// Note!!!, must in observer context
autorun(() => {
  console.log(user.value.name)
})

user.loading // default false, true when requesting data
user.restore()
user.value.name // ''
```

* Parameters type `MobxLazyOption`, same with `MobxRequestOption`

```typescript
interface MobxLazyOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>
}
```

* Return type `MobxLazyValue`

```typescript
interface MobxLazyValue<Data, Request extends RequestFunction> {
  value: Data
  set: (v: Data) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel: () => void
  loading: boolean
  requested: boolean
  cancel(): void
  ready: Promise<Data>
  refresh(): void
  reset(): void
}
```
