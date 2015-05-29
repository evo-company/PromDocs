import Rx from 'rx'
import range from 'lodash.range'

import {wrapToDisplay, renderStream, accumutate, getMockKeys} from '../vision'
import {getNavigationStream} from '../navigation'

export default () => {
  var keyCodesStream = getMockKeys()

  var ctx = document.querySelector('#main canvas').getContext("2d")

  var frameStream = Rx.Observable.create(observer => (function loop() {
    window.requestAnimationFrame(() => {
      observer.onNext([null, 1.3])
      loop()
    })
  })())

  var canvasKeysMap = keyCodesStream
    .map(wrapToDisplay(document.querySelector('#main canvas').getContext("2d")))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasKeysFilter = keyCodesStream
    .map(key => key + 10)
    .map(wrapToDisplay(document.querySelector('#part_0 canvas').getContext("2d")))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  canvasKeysMap.subscribe(renderStream(document.querySelector('#main canvas')))
  canvasKeysFilter.subscribe(renderStream(document.querySelector('#part_0 canvas')))

  if (location.hash === '#touch') {
    for (var el of document.querySelectorAll('[hidden]')) {
      el.hidden = false
    }
  }

  getNavigationStream(false)
    .subscribe(({acc, parts}) => {
      for (var index of range(parts)) {
        document.getElementById('part_'+index).hidden = acc <= index
      }
    })
}
