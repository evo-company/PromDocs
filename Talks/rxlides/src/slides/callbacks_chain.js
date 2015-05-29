import range from 'lodash.range'

import {getNavigationStream} from '../navigation'

export default () => {
  getNavigationStream(true)
    .subscribe(({acc, parts}) => {
      document.getElementById('main').hidden = !!acc
      document.getElementById('part_1').hidden = !acc
    })
}
