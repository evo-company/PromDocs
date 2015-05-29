import Rx from 'rx'
import range from 'lodash.range'

import {wrapToDisplay, renderStream, accumutate, getMockKeys} from '../vision'
import {getNavigationStream} from '../navigation'

const [Q, W, E] = [81, 87, 69]

export default () => {
  var keyCodesStream

  if (location.hash === '#touch') {
    keyCodesStream = getMockKeys()
      .zip(
        Rx.Observable.from([E, Q, Q, E, Q, W, Q, Q]),
        (m, keyCode) => keyCode
      )
      .take(8)
      .repeat()
  } else {
    keyCodesStream = Rx.Observable
    .fromEvent(document.body, 'keyup')
    .pluck('keyCode')
    .filter(keyCode => keyCode === 32 || keyCode >= 65 && keyCode <= 90)
  }

  var ctx = document.querySelector('#main canvas').getContext("2d")

  var frameStream = Rx.Observable.create(observer => (function loop() {
    window.requestAnimationFrame(() => {
      observer.onNext([null, 1.3])
      loop()
    })
  })())

  var canvasKeys = keyCodesStream
    .map(keyCode => `[${String.fromCharCode(keyCode)}]`)
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasQs = keyCodesStream
    .filter(keyCode => keyCode === Q)
    .map(keyCode => `[${String.fromCharCode(keyCode)}]`)
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasWs = keyCodesStream
    .filter(keyCode => keyCode === W)
    .map(keyCode => `[${String.fromCharCode(keyCode)}]`)
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasSkipUntil = keyCodesStream
    .filter(keyCode => keyCode === Q)
    .skipUntil(keyCodesStream.filter(keyCode => keyCode === W))
    .map(keyCode => `[${String.fromCharCode(keyCode)}]`)
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasDelay = keyCodesStream
    .filter(keyCode => keyCode === Q)
    .delay(1000)
    .map(keyCode => `[${String.fromCharCode(keyCode)}]`)
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  var canvasInterval = keyCodesStream
    .filter(keyCode => keyCode === Q)
    .timeInterval()
    .map(v => Math.floor(v.interval / 1000))
    .map(wrapToDisplay(ctx))
    .merge(frameStream)
    .scan([], accumutate)
    .distinctUntilChanged()

  canvasKeys.subscribe(renderStream(document.querySelector('#main canvas')))
  canvasSkipUntil.subscribe(renderStream(document.querySelector('#part_0 canvas')))
  canvasDelay.subscribe(renderStream(document.querySelector('#part_1 canvas')))
  canvasInterval.subscribe(renderStream(document.querySelector('#part_2 canvas')))

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
