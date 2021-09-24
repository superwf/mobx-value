import Enzyme from 'enzyme'
import { configure } from 'mobx'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import React from 'react'

configure({ enforceActions: 'always' })

global.React = React

Enzyme.configure({ adapter: new Adapter() })
