* [Установка](#%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0)
* [Запуск](#%D0%97%D0%B0%D0%BF%D1%83%D1%81%D0%BA)
* [Написание тестов aka jasmine-часть](#%D0%9D%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-%D1%82%D0%B5%D1%81%D1%82%D0%BE%D0%B2-aka-jasmine-%D1%87%D0%B0%D1%81%D1%82%D1%8C)
  * [.specs.coffee](#specscoffee)
  * [Тестирование вызовов функций](#%D0%A2%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%BE%D0%B2-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B9)
  * [Тестирование асинхронных вызовов](#%D0%A2%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B0%D1%81%D0%B8%D0%BD%D1%85%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D1%85-%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%BE%D0%B2)
  * [Тестирование UI](#%D0%A2%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-ui)
    * [Добавление UI-элементов в тест](#%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-ui-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%B2-%D1%82%D0%B5%D1%81%D1%82)
      * [Создание DOM-элементов в самом тесте](#%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-dom-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%B2-%D1%81%D0%B0%D0%BC%D0%BE%D0%BC-%D1%82%D0%B5%D1%81%D1%82%D0%B5)
      * [\_SpecRunner.html](#_specrunnerhtml)
    * [Триггер событий](#%D0%A2%D1%80%D0%B8%D0%B3%D0%B3%D0%B5%D1%80-%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B9)
  * [appstate.coffee](#appstatecoffee)
* [Редактирование тест-тасок aka grunt-часть](#%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D1%82%D0%B5%D1%81%D1%82-%D1%82%D0%B0%D1%81%D0%BE%D0%BA-aka-grunt-%D1%87%D0%B0%D1%81%D1%82%D1%8C)
  * [grunt-contrib-jasmine](#grunt-contrib-jasmine)

---

# Установка

`npm install` или `npm install grunt-contrib-jasmine` из корня проекта

# Запуск

Есть несколько способов запуска cпеков/тесткейсов:

* `grunt tests` / `grunt test`

    *Компилирует* и *запускает* все спеки из папок uaprom/cs/domain/*/tests

* `grunt tests:zoo`

    *Компилирует* и *запускает* все спеки реалма zoo

* `grunt tests:build`

    *Компилирует* и сохраняет [**\_SpecRunner.html**](#_specrunnerhtml) в текущую папку

* `grunt jasmine`

    *Запускает* уже скомпилированные в .js спеки

* `grunt coffee:tests`

    *Компилирует* все спеки из папок uaprom/cs/domain/*/tests

* `grunt coffee:appstate`

    *Компилирует* все [appstate.coffee](#appstatecoffee) реалмов


`grunt tests` и `grunt jasmine` могут принимать аргумент [--filter="[маска файла]"](https://github.com/gruntjs/grunt-contrib-jasmine#filtering-specs) для запуска определённых спеков:

    grunt tests --filter="Elephant"

Для корректной работы тестов, client side-код должен быть "свежим" (либо `cafe menu build`, либо cafe следит за изменениями файлов и всё уже сделано)

# Написание тестов aka jasmine-часть

[Страница модуля](http://jasmine.github.io/2.0/introduction.html)

[Спеки/тесткейсы](#specscoffee) хранятся в папках uaprom/cs/domain/*/tests и при запуске разделяются по realm'ам (portal, cabinet etc.) и заканчиваются на "specs.coffee"

Если папки с подходящим реалмом ещё нет, то перед написанием тестов нужно будет добавить её в [**Gruntfile.coffee**](#grunt-contrib-jasmine)

## .specs.coffee

Содержит наборы тестов, которые [описываются](http://jasmine.github.io/2.0/introduction.html#section-Grouping_Related_Specs_with_<code>describe</code>) функцией `describe(String suiteName, function suiteCode)`. В suiteName указывается название тестируемого модуля

Сами спеки описываются функцией `it(String testName, Function testCode)` внутри suiteCode. Общий для каждого теста код указывается функциями `beforeEach(Function callback)` и `afterEach(Function callback)`

Ожидания/допущения ([expectation/assertion](http://jasmine.github.io/2.0/introduction.html#section-Expectations)) создаются с помощью функции `expect(Object value)`, и имеют атрибут `.not`, методы `.toBe(Object value)`, `.toEqual(Object value)`, `.toBeTruthy()`, `.toBeFalsy()` и [другие](http://jasmine.github.io/2.0/introduction.html#section-Included_Matchers)

``` coffeescript
# cs/domain/Elephant/index.coffee
module.exports =
    buyElephantsText: ->
        "Покупайте слонов на test.uaprom"
```

``` coffeescript
# cs/domain/Elephant/tests/specs.coffee
Elephant = require 'Elephant'

describe 'Elephant suite', ->
    {buyElephantsText} = Elephant

    it 'valid buyElephantsText', ->
        expect(buyElephantsText()).toContain 'test'
```

Страница модуля практически полностью состоит из примеров, в которых замаскирована документация, а более-менее традиционное [описание API](https://github.com/pivotal/jasmine/wiki) deprecated потому что 2.0

## Тестирование вызовов функций

Для тестирования вызова функций используются [шпионы](http://jasmine.github.io/2.0/introduction.html#section-Spies). Для создания шпиона, нужно вызвать функцию `spyOn(Object module, String methodName)`. После этого, `module.methodName` будет заменён на новую функцию, у которой появляется атрибут `.calls` с информацией о её вызовах и методы `.and.callFake(Function callback)`, `.and.stub()` и прочие для модификации поведения наблюдаемой функции

``` coffeescript
# cs/domain/Elephant/tests/specs.coffee
Elephant = require 'Elephant'

describe 'Elephant suite', ->
    it 'spy on buyElephantsText', ->
        spyOn Elephant, 'buyElephantsText'
        Elephant.buyElephantsText()
        Elephant.buyElephantsText()
        expect(Elephant.buyElephantsText.calls.count()).toEqual 2
```

## Тестирование асинхронных вызовов

Если тестируемый функционал зависит от асинхронного вызова, то коллбек, описывающий спек, должен принимать параметром функцию `done()` и вызывать её по завершению асинхронного вызова

``` coffeescript
# cs/domain/Mammoth/index.coffee
module.exports =
    _resurrect: -> require('darkMagic').perform()
    delayedResurrection: (cb) ->
        setTimeout(
            =>
                @_resurrect()
                cb()
            100
        )
```

``` coffeescript
# cs/domain/Mammoth/tests/specs.coffee
Mammoth = require 'Mammoth'

describe 'Mammoth suite', ->
    it 'should resurrect mammoth', (done) ->
        resurrectionCalled = false

        spyOn(Mammoth, '_resurrect').and.callFake ->
            resurrectionCalled = true

        Mammoth.delayedResurrection ->
            expect(resurrectionCalled).toBe true
            done()
```

## Тестирование UI
### Добавление UI-элементов в тест
#### Создание DOM-элементов в самом тесте

**Желательно использовать именно этот способ**

Для красивого и быстрого добавления элементов можно использовать функцию `affix(String selector)` из [jasmine-fixture](https://github.com/searls/jasmine-fixture), которая принимает CSS селектор, добавляет подходящий этому селектору jQuery-ноду на страницу и возвращает её:


``` coffeescript
# cs/domain/Whale/tests/specs.coffee
$ = require 'jquery'

describe 'Whale suite', ->
    beforeEach ->
        affix ".whale[data-name='Moby']"  # <div class="whale" data-name="Moby"></div>
    
        affix("div#ocean")
            .affix("span.river#white+span.river#black+span.river#red")  # <div id="ocean"><span class="river" id="white"></span><span class="river" id="black"></span><span class="river" id="red"></span></div>
    
    afterEach ->
        $(".whale").remove()
        $("div#ocean").remove()
    
    it 'check nodes', ->
        expect($('.whale').data 'name').toBe 'Moby'
```

В спеках желательно использовать те же селекторы, что и в тестируемом коде

Для доступа к `affix(String selector)` нужно добавить `'./uaprom/cs/tests/_assets/jasmine-fixture.min.js'` в конец `src` конфига реалма в [**Gruntfile.coffee**](#grunt-contrib-jasmine) (сам модуль зависит от jQuery):

``` coffeescript
# Gruntfile.coffee
jasmine:
    # …
    zoo:
        src: [
            './uaprom/cs/tests/build/zoo/appstate.js'
            './uaprom/public/js/build/zoo/core.js'  # <- здесь определяется window.jQuery
            './uaprom/public/js/build/zoo/common.js'
            './uaprom/cs/tests/_assets/jasmine-fixture.min.js'
        ]
```

#### \_SpecRunner.html

При запуске тестов, jasmine создаёт файл **\_SpecRunner.html**. В этом файле указаны все необходимые для теста скрипты, стили и т.п. и именно этот файл нужно использовать для дебага тестов

По умолчанию, `grunt tests` удаляет этот файл после окончания тестов. Для того, чтобы файл не удалялся, нужно запустить таску `grunt tests:build` (или `grunt tests:[название реалма]:build`)

Для того, чтобы при генерации тестов реалма использовался нестандартный шаблон, его нужно указать в его опциях в [**Gruntfile.coffee**](#grunt-contrib-jasmine):

``` coffeescript
# Gruntfile.coffee
jasmine:
    # …
    zoo:
        # …
        options:
            specs: './uaprom/cs/tests/zoo/Runner.tmpl'
```

За основу можно взять файл **uaprom/cs/tests/_assets/DefaultRunner.tmpl**

### Триггер событий

PhantomJS, используемый для прогона тестов, не умеет "кратко" триггерить DOM-события, так что для этого лучше использовать jQuery:

``` coffeescript
$('.whale').focus()
```

## appstate.coffee

Многие скрипты проекта требуют объект CS, который генерируется при загрузке страниц на стороне сервера. Поэтому для тестов нужно делать мок этого объекта, что делается в файле **appstate.coffee**

``` coffeescript
# cs/tests/zoo/appstate.coffee
window.AppState.config =
    CS:
        CURRENT_DOMAIN: 'test.uaprom'
        CURRENT_ORIGIN: 'http://test.uaprom'
        DEFAULT_ORIGIN: 'https://my.test.uaprom'
```

В ~~тёмном~~ ~~светлом~~ будущем с функторами и монадами, потребности в CS не будет. Но до тех пор, нужно использовать **appstate.coffee** или все зависимости от CS передавать в виде опциональных параметров:

``` coffeescript
# cs/domain/Elephant/index.coffee
{get_config} = require 'libconfig'
CS = get_config 'CS'
module.exports =
    buyElephantsText: (domain=CS.CURRENT_DOMAIN) ->
        "Покупайте слонов на #{domain}"
```

``` coffeescript
# cs/domain/Elephant/tests/specs.coffee
Elephant = require 'Elephant'

describe 'Elephant suite', ->
    {buyElephantsText} = Elephant

    it 'valid buyElephantsText', ->
        expect(buyElephantsText()).toContain 'test' # падает если в appstate.coffee нет CS.CURRENT_DOMAIN
        expect(buyElephantsText 'ping.uaprom').toContain 'ping'
```

# Редактирование тест-тасок aka grunt-часть

## grunt-contrib-jasmine

[Страница модуля](https://github.com/gruntjs/grunt-contrib-jasmine)

Описания тасок указаны в объекте jasmine, передающимся при инициализации grunt'а в **Gruntfile.coffee**

``` coffeescript
# Gruntfile.coffee
jasmine:
    # …
    zoo:
        src: [
            './uaprom/cs/tests/build/zoo/appstate.js'
            './uaprom/public/js/build/zoo/core.js'
            './uaprom/public/js/build/zoo/common.js'
        ]
        options:
            display: 'short'
            summary: true
            specs: './uaprom/cs/tests/build/zoo/*.specs.js'
            vendor: [
                './uaprom/cs/bootstrap/out/require-min.js'
                './uaprom/cs/bootstrap/out/bootstrap-debug-min.js'
            ]
```

* **realm**

    Тесты разбиты по предварительно собранным realm'ам сайта. Для тестирования отдельного реалма можно использовать grunt tests:\[название реалма\] (например, `grunt tests:zoo`)

  * **src**

    * Здесь указываются [AppState](#appstatecoffee) приложения (если требуется, а чаще всего так и будет) и js-файлы с тестируемым кодом


    Очень важен порядок — **appstate.coffee** первым, **core.js** перед **common.js** (в последнем множество jQuery-плагинов, ожидающих window.jQuery, который загружается в **core.js**)

  * **options**
    * **display** и **summary**
      * Формат вывода, ничего примечательного

    * **specs**
      * Скомпилированные из .coffee в .js спеки. Компилятся командой `grunt coffee:tests` или автоматически при запуске `grunt tests`

    * **vendor**
      * js-файлы с внешними библиотеками. Так как они у нас уже есть в core/common, сюда обязательные для всех страниц bootstrap'овые файлы (вроде **require.js**)

Разделение на src и vendor чисто семантическое — можно всё указать в одном из них, но нужно учитывать, что в результирующем [**\_SpecRunner.html**](#_specrunnerhtml) скрипты из vendor идут перед src