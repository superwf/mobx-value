# Mobx eazy usage encapsulation

模仿 `mobx-utils` 的基于`mobx`的工具方法集，由于 `mobx-utils` 经常不能满足我的项目需求，因此便有了 `mobx-value`。

基于 Mobx 6.

## 共四个生成方法

由这四种方法生成的变量，都应用在由`mobx-react`的`observer`方法生成的组件中，以实现自动响应式更新。

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

### boolean, 基于 setter

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

### request, 基于 setter

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

/** only request once */
user.request() // auto debounce
user.request() // when last request not complete
user.request() // new request will be debounced
```

* Parameters type `MobxRequestOption`

```typescript
interface MobxRequestOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>
  parallel?: boolean
}
```

* Return type `MobxRequestValue`

```typescript
interface MobxRequestValue<Data, Request extends (args?: any) => Promise<Data>> {
  value: Data
  // 除了等待请求完成后填充value数据，也可使用set直接设置value
  set: (v: Data) => void
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  // 如果当前在请求中，则取消请求
  cancel: () => void
  loading: boolean
  /** 基于最后一次请求的参数，重新请求 */
  refresh: () => CancellablePromise<Data>
}
```

### lazy, 基于 request

* Example

```typescript
const user = mobxLazy({ value: { name: '' }, request: () => Promise.resolve({ name: 'abc' })})

// 在autorun中的代码将运行两次
// 一次由请求触发，另一次由restore触发
// 注意，发起lazy请求必须在observer的上下文环境中，例如autorun，reaction或mobx-react的observer包裹的组件
// 直接使用是不会引起lazy请求的
autorun(() => {
  console.log(user.value.name)
})

user.loading // default false, true when requesting data
user.restore()
user.value.name // ''
```

* Parameters type `MobxLazyOption`, 与 `MobxRequestOption` 相同

```typescript
interface MobxLazyOption<Data> {
  value: Data,
  annotation?: observable | observable.shallow
    | observable.struct | observable.deep
    | observable.ref | true
  request: (args?: any) => Promise<Data>
  parallel?: boolean
}
```

* Return type `MobxLazyValue`

```typescript
interface MobxLazyValue<Data, Request extends RequestFunction> {
  value: Data
  set: (v: Data) => void
  // restore仅将value数据恢复到初始状态
  restore: () => void
  request: (...args: Parameters<Request>) => CancellablePromise<Data>
  cancel: () => void
  loading: boolean
  /** 记录是否被请求过 */
  requested: boolean
  cancel(): void
  ready: Promise<Data>
  refresh(): void
  /**
   * 执行restore，并重置为未请求状态
   * 如果重新进入observer环境则会再次发起request
   * 抛弃当前运行结果并重置所有属性为初始状态
   */
  reset(): void
}
```
