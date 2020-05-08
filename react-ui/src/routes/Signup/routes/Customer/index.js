import { Loadable } from 'utils/components'

export default {
  path: 'customer',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/CustomerPage')
  })
}
