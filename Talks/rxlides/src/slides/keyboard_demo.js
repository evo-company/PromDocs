import Rx from 'rx'
import range from 'lodash.range'

import {getNavigationStream} from '../navigation'

const [Q, W, E, A, S, D] = [81, 87, 69, 65, 83, 68]
const keyIds = {
  [Q]: 'wasd_q',
  [W]: 'wasd_w',
  [E]: 'wasd_e',
  [A]: 'wasd_a',
  [S]: 'wasd_s',
  [D]: 'wasd_d',
}

export default () => {
  var keys = Rx.Observable.fromEvent(document.body, 'keydown').pluck('keyCode')
  var startStream = keys.filter(keyCode => keyCode === Q)
  var stopStream = keys.filter(keyCode => keyCode === E)

  var setActive = (keyCode) => {
    for (var keySpan of document.querySelectorAll('.wasd.active')) {
      keySpan.classList.remove('active')
    }

    if (keyCode) { document.getElementById(keyIds[keyCode]).classList.add('active') }
  }

  Rx.Observable.fromEvent(document.body, 'keyup').map(null).subscribe(setActive)
  startStream
    .map(q => keys
      .startWith(q)
      .takeUntil(stopStream)
    )
    .switch()
    .filter(keyCode => keyIds[keyCode])
    .subscribe(setActive)

  getNavigationStream(true)
    .subscribe(({acc, parts}) => {
      for (var index of range(1, parts+1)) {
        document.getElementById('part_'+index).style.color = (!acc || acc === index) ? 'black' : 'gray'
      }
    })
}
