import Rx from 'rx'
import range from 'lodash.range'

import {getNavigationStream} from '../navigation'

const [inactiveStar, activeStar] = ['☆', '★']

function getDomPath(e) {
  if (e.path) { return e.path }

  var path = [];
  var node = e.target;
  while (node != document.body) {
    path.push(node);
    node = node.parentNode;
  }
  return path;
}

export default () => {
  var favsStream = new Rx.Subject()

  Rx.Observable.fromEvent(document.body, 'click')
    .map(getDomPath)
    .map(path => path.find(p => p.classList && p.classList.contains('gif_cell')))
    .filter(cell => cell)
    .map(cell => ({
      id: parseInt(cell.dataset.id, 10),
      active: cell.querySelector('.star').textContent === inactiveStar
    }))
    .scan(new Set([1, 2, 4]), (acc, v) => {
      v.active ? acc.add(v.id) : acc.delete(v.id)
      return acc
    })
    .subscribe(favsStream)

  favsStream
    .subscribe(favs => {
      for (var gifCell of document.querySelectorAll('.gif_cell')) {
        gifCell.querySelector('.star').textContent = (
          favs.has(parseInt(gifCell.dataset.id, 10)) ? activeStar : inactiveStar
        )
      }
    })

  favsStream
    .pluck('size')
    .subscribe(count => document.querySelector('.star_count').textContent = count)

  getNavigationStream(true)
    .do(({acc}) => {
      if (!acc || acc === 1) {
        for (var img of document.querySelectorAll('img')) {
          acc ? img.classList.add('transparent') : img.classList.remove('transparent')
        }
        for (var img of document.querySelectorAll('.star')) {
          acc ? img.classList.add('visible') : img.classList.remove('visible')
        }
      }
    })
    .subscribe(({acc, parts}) => {
      for (var index of range(1, parts+1)) {
        document.getElementById('part_'+index).hidden = acc !== index
      }
    })
}
