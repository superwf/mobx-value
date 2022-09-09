import * as defaultMobx from 'mobx'

let mobx = defaultMobx

export const getMobx = () => mobx

export const setMobx = (m?: any): void => {
  if (m) {
    mobx = m
  }
}
