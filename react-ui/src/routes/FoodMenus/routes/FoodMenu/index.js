import { Loadable } from 'utils/components'

export default {
  path: ':foodMenuId',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/FoodMenuPage')
  })
}
