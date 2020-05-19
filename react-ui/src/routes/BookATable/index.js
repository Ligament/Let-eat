import { BOOK_A_TABLE as path } from 'constants/paths'
import { Loadable } from 'utils/components'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'BookATable' */ './components/BookATablePage')
  })
}
