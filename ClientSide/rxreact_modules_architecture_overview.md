## Архитектура javascript модулей с использованием [Rx.js](https://github.com/Reactive-Extensions/RxJS) и [React.js](http://facebook.github.io/react/) (RxReact).

#### Что необходимо для понимания данного чтива?
1. Базовое владение coffeescirpt.
2. Понимание механизма работы [Rx.Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), [Rx.Subject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/subjects.md) из [Rx.js](https://github.com/Reactive-Extensions/RxJS).
3. Базовое понимание Reactjs.

### Содержание
- [Intro](#Intro)
- [Структурная схема модуля](#Структурная-схема-модуля)
- [Основные компоненты](#Основные-компоненты)
- [Файловая структура модуля](#Файловая-структура-модуля)
- [Инициализация модуля](#Инициализация-модуля)
  - [interface.coffee](#interfacecoffee)
  - [app.coffee](#appcoffee)
- [View Layer](#view-layer)
  - [view.coffee](#viewcoffee)
- [Storage (Model)](#storage-model)
  - [storage.coffee](#storagecoffee)
- [Dispatcher](#dispatcher)
  - [dispatcher.coffee (dispatch функция)](#dispatchercoffee---%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F-%D0%B4%D0%B8%D1%81%D0%BF%D0%B0%D1%82%D1%87%D0%B8%D0%BD%D0%B3%D0%B0)
  - [dispatcher.coffee (getViewState функция)](#dispatchercoffee---getviewstate-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F)
- [Более продвинутый пример](#Более-продвинутый-пример)

Если до этого не использовали Rx.js и reactive programming очень рекомендую статью - [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

### Intro
В Основе данного подхода лежит концепция, которая во многом схожа с [Flux](https://facebook.github.io/flux/). К такому способу мы пришли не сразу, а после определенного <s>боль и страдания</s> опыта. Flux сам по себе не является фреймворком, это скорее архитектура или паттерн для структурирования javascript UI приложений с использованием React-а как слоя представления.

### Структурная схема модуля
В итоге мы пришли к такой архитектуре javascript модулей:
![ModuleStructure](http://s4.postimg.org/wau2b26x9/Module_Structure_1.png)

### Основные компоненты
Для примера будет рассмотрено создание тестового модуля с помощью <b>Yeoman</b>. Поэтапный процесс описан в этой доке - [Создание нового модуля на базе Rx.js + React.js с помощью Yeoman](https://gist.github.com/AlexMost/d134d1a74e1fad00a3b9).

### Файловая структура модуля
Вначале генератор создаст нам такую файловую структуру:

```
.
├── app.coffee
├── dispatcher.coffee
├── index.coffee
├── interface.coffee
├── slug.json
├── storage.coffee
└── view
    └── view.coffee
```
Основные составляющие данной структуры будут более подробно описаны ниже.

### Инициализация модуля
За инициализацию модуля отвечают файлы: interface.coffee и app.coffee.
#### interface.coffee

```coffeescript
# импорт функции инициализации приложения
initApp = require './app'

# Реализация интерфейса модуля 'Hello'
Impl = (node) ->
    # Данный код будет выполнен после загрузки страници на 
    # DOM элементе с data-extend="Hello"
    initApp(node)
    {}


module.exports =
    protocols:
        definitions:
            Hello: []
        implementations:
            Hello: Impl
```
Данный код позволяет нам отрисовать наш модуль без единой строчки javascript в шаблонах. Для того чтобы увидеть на страничке модуль - необходимо добавить data-extend="Hello" (Hello - имя нашего модуля) в Mount ноду. Mount нода - DOM элемент в который мы хотим отрисовывать наше приложение.

Пример инициализации модуля в шаблоне:
```html
<div data-extend="Hello"></div>
```

#### app.coffee
```coffeescript
Rx = require 'rx'
React = require 'react'
HelloView = React.createFactory(require './view')
HelloStorage = require './storage'
dispatchActions = require './dispatcher'

# Данная функция создает основные компоненты для нашего приложения:
initApp = (mountNode) ->
    # Rx стрим
    subject = new Rx.Subject()
    
    # Хранилище данных
    store = new HelloStorage()
    
    # View
    view = React.render HelloView({eventStream: subject}), mountNode
    
    # передает в диспатчер основные компоненты
    dispatchActions(view, subject, store)


module.exports = initApp
```

### View Layer
Каждый React компонент в this.props содержит eventStream, в который должен только писать события (@props.eventStream.onNext). Данная архитектура подразумевает что React компоненты содержат минимум логики, только то что относится непосредственно к отображению. 

#### view.coffee:
```coffeescript
HelloView = React.createClass
    getDefaultProps: ->
        clicksCount: 0

    incrementClickCount: ->
        @props.eventStream.onNext
            action: "increment_click_count"

    render: ->
        div null,
            div null, "You clicked #{@props.clicksCount} times"
            button
                onClick: @incrementClickCount
                "Click"
```

Из примера выше видно, что view сигнализирует о неком событии (клика по кнопке) с помощью eventStream. Сам же компонент не имеет понятия о том как и что дальше будет происходить, его задача только отрисовка состояния (view state) и оповещение о неких событиях.

### Storage (Model)
Хранилище данных для приложения. Данный компонент не знает ничего о view о dispatcher-е, он оперирует неким набором данных который можно менять, читать, удалять.

#### storage.coffee
```coffeescript
class HelloStorage
    constructor: ->
        @clicksCount = 0

    getClicksCount: -> @clicksCount

    incrementClicksCount: ->
        @clicksCount += 1
```

В данном примере storage это обычный coffeescript класс.


### Dispatcher
Диспатчер - компонент у которого есть 2 четкие задачи:

1. Обновление storage.
2. Обновление view.

#### dispatcher.coffee - функция диспатчинга:
```coffeescript
# view - React компонент.
# subject - Rx.Subject
# store - обьект для хранения данных.
dispatch_actions = (view, subject, store) ->
    
    # Создаем источник действий увеличения счетчика.
    incrementClickCountAction = subject
        .filter(({action}) -> action is "increment_click_count")
        .do(->
              # Увеличиваем счетчик в storage. 
              store.incrementClicksCount())

    # Подписываемся на все источники действий которые могут обновлять view
    Rx.Observable.merge(
        incrementClickCountAction
        # еще очень много источников ...
        # каждый из которых является Rx.Observable и в итоге 
        # может инициировать обновление UI
    ).subscribe(
        # Обновляем view
        -> view.setProps getViewState(store)
        # Обрабатываем ошибки
        (err) ->
            console.error? err)
```

В самом диспатчере мы можем (должны) использовать всю красоту и мощь Rx, для построения компонуемых цепочек из асинхронных и не асинхронных вычислений. 

Так-же в файле dispatcher.coffee определена функция getViewState - она нужна нам для того чтобы не передавать целый storage инстанс в view. Она вынимает из хранилища только те значения, которые нужны во view. Можно в принципе и на прямую передавать инстанс storage в props компоненту, но тогда появляется возможность использовать разные методы нашего хранилища, и добавлять дополнительную логику туда где ее не должно быть.

#### dispatcher.coffee - getViewState функция
```coffeescript
# Во view нам по сути нужно только количество кликов.
getViewState = (store) ->
    clicksCount: store.getClicksCount()
```
## Более продвинутый пример
Пример с одним источником кликов не совсем интересен. Для демонстрации что нам дает Rx давайте представим что мы хотим так-же:
- уменьшать значение
- сохранять его на сервер при изменении но не чаще чем раз в секунду и только если оно поменялось.
- показывать сообщение об успешном сохранении
- прятать сообщение об успешном сохранении через 2 секунды

В результате должно выйти такое приложение - [demo](http://alexmost.github.io/RxReact/hello_world2/public/index.html).

Вот как изменился код диспатчера (dispatcher.coffee):

```coffeescript
dispatchActions = (view, subject, store) ->
    # источник инкремента значения
    incrementClickCountSource = subject
        .filter(({action}) -> action is "increment_click_count")
        .do(-> store.incrementClicksCount())
        .share()

    # источник декремента значения
    decrementClickCountSource = subject
        .filter(({action}) -> action is "decrement_click_count")
        .do(-> store.decrementClickscount())
        .share()

    # получаем сумарный источник изменения значения счетчика (декремент + инкремент).
    countClicks = Rx.Observable
        .merge(incrementClickCountSource, decrementClickCountSource)
 
    # Источник событий успешной синхронизации кликов с сервером.
    showSavedMessageSource = countClicks
        .throttle(1000)
        .distinct(-> store.getClicksCount())
        .flatMap(-> saveToDb store.getClicksCount())
        .do(-> store.enableSavedMessage())

    # Источник событий для скрытия сообщения после успешного сохранения.
    hideSavedMessage = showSavedMessageSource.delay(2000)
    .do(-> store.disableSavedMessage())

    Rx.Observable.merge(
        # Оbservable источники, которые обновляют UI
        countClicks
        showSavedMessageSource
        hideSavedMessage
    ).subscribe(
        -> view.setProps getViewState(store)
        (err) ->
            console.error? err)
```

Как видно путем не сложных манипуляций с Rx.js мы добавили довольно не тривиальную логику нашему приложению.
