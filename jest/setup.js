import Enzyme from 'enzyme'
import { configure } from 'mobx'
import * as mobx60 from 'mobx60'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import React from 'react'
import { setMobx } from '../src/mobx'

configure({ enforceActions: 'always' })

if (process.env.MOBX60) {
  setMobx(mobx60)
}

global.React = React

Enzyme.configure({ adapter: new Adapter() })
