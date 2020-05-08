import { Loadable } from 'utils/components'

export default {
  path: 'business',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/BusinessPage')
  })
}
