import range from 'lodash.range'

import {getNavigationStream} from '../navigation'

export default () => {
  getNavigationStream(true)
    .subscribe(({acc, parts}) => {
      for (var index of range(1, parts+1)) {
        document.getElementById('part_'+index).style.color = (!acc || acc === index) ? 'black' : 'gray'
      }
    })
}
