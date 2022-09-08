import * as defaultMobx from 'mobx'

const mobx = {
  mobx: defaultMobx,
}

export default mobx

export const configureMobx = (m?: any): void => {
  if (m) {
    mobx.mobx = m
  }
}
