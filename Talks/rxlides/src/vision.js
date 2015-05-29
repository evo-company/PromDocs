import Rx from 'rx'
import range from 'lodash.range'

export function renderStream(canvas) {
  var ctx = canvas.getContext("2d")

  return keys => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = document.body.style.font
    ctx.fillStyle = "#00A500"

    for (var {text, position, mirror} of keys) {
      ctx.fillText(text, mirror ? canvas.width - position : position, canvas.height - 7)
    }
  }
}

export function accumutate(acc, [value, shift]) {
  if (value) {
    acc = [value, ...acc]
  }

  return acc
    .filter(({position}) => position <= document.body.clientWidth)
    .map(({text, position, mirror}) => ({text, position: position+shift, mirror}))
}

export function wrapToDisplay(ctx) {
  return text => [{text, position: parseInt(ctx.measureText(text).width, 10), mirror: true}, 0]
}

export function getMockKeys() {
  var touchMockKeys = range(65, 91).concat(32)

  return Rx.Observable.interval(2000)
    .startWith(null)
    .flatMap(() => Rx.Observable.timer(Math.random() * 2000 - 500))
    .map(() => touchMockKeys[parseInt(Math.random() * touchMockKeys.length)])
    .share()
}
