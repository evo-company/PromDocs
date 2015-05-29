import zipObject from 'lodash.zipobject'

import mapFilterFlatmap from './map_filter_flatmap.js'
import keyboardDemo from './keyboard_demo.js'
import intervalDemo from './interval_demo.js'
import singleSubscribe from './single_subscribe.js'
import singleCallback from './single_callback.js'
import callbacksChain from './callbacks_chain.js'
import promisesCons from './promises_cons.js'
import programmableStream from './programmable_stream.js'
import gifflixDemo from './gifflix_demo.js'
import componentsCommunication from './components_communication.js'
import summary from './summary.js'

const slides = [
  ['index', null],
  ['ui', null],
  ['single_callback', singleCallback],
  ['microsoft_xhr', null],
  ['callbacks_sync', null],
  ['callbacks_chain', callbacksChain],
  ['promises', null],
  ['promises_chain', null],
  ['promises_cons', promisesCons],
  ['microsoft_go4', null],
  ['single_subscribe', singleSubscribe],
  ['map_filter_flatmap', mapFilterFlatmap],
  ['interval_demo', intervalDemo],
  ['keyboard_demo', keyboardDemo],
  ['programmable_stream', programmableStream],
  ['gifflix_demo', gifflixDemo],
  ['components_communication', componentsCommunication],

  ['summary', summary],
  ['links', null],
]

export var prevSlide = slide => {
  var slidesName = slides.map(s => s[0])
  var slideIndex = slidesName.indexOf(slide)

  switch (slideIndex) {
    case -1:
    case 0:
      return
    case 1:
      return '../index.html'
    default:
      return `./${slidesName[slideIndex - 1]}.html`
  }
}

export var nextSlide = slide => {
  var slidesName = slides.map(s => s[0])
  var slideIndex = slidesName.indexOf(slide)

  switch (slideIndex) {
    case -1:
    case slidesName.length - 1:
      return
    case 0:
      return `./slides/${slidesName[1]}.html`
    default:
      return `./${slidesName[slideIndex + 1]}.html`
  }
}

export var slideLogic = slide => {
  var logic = zipObject(slides)[slide]
  if (logic) { logic() }
}
