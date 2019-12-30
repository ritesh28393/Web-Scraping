# Web-Scraping

<https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e>

<https://learnscraping.com/nodejs-web-scraping-with-puppeteer/>

<https://pptr.dev/>

<https://software.hixie.ch/utilities/js/live-dom-viewer/>

<https://www.w3schools.com/jquery/jquery_dom_get.asp>

<https://www.udemy.com/course/nodejs-web-scraping/>

<https://github.com/GoogleChrome/puppeteer/tree/master/examples>

<https://www.w3schools.com/cssref/css_selectors.asp>

<https://www.youtube.com/watch?v=IvaJ5n5xFqU>

```js
var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
```

## Commands
* npm init
* npm i --save puppeteer
## Cheerio (replace with JQUERY)
* preferred method
  ```js
  const cheerio = require('cheerio');
  const $ = cheerio.load('<ul id="fruits">...</ul>');
  ```
* **Selectors**
  ```js
  $( selector, [context], [root] ) // selector searches within the context scope which searches within the root scope
  ```
* **Attributes:** Methods for getting and modifying attributes.
  ```js
  .attr( name, value )  // Method for getting and setting attributes. Gets the attribute value for only the first element in the matched set. If you set an attribute’s value to null, you remove that attribute
  .prop( name, value )  // Method for getting and setting properties
  .data( name, value )  // Method for getting and setting data attributes
  .val( [value] )  // Method for getting and setting the value of input, select, and textarea
  ```
* **Traversing**
  ```js
  .find(selector | selection | node)  // Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
  .parent([selector])  // Get the parent of each element in the current set of matched elements
  .parents([selector])
  .closest(selector)  // For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
  .next([selector])
  .nextAll([selector])
  .prev([selector])
  .prevAll([selector])
  .siblings([selector])  // Gets the first selected element’s siblings, excluding itself.
  .children([selector])  // Gets the children of the first selected element.
  ```
* **.each( function(index, element) )**
  ```js
  const fruits = [];
  $('li').each(function(i, elem) {
    fruits[i] = $(this).text(); // this refers to the current element
    // To break out of the each loop early, return with false.
  });
  fruits.join(', '); //=> Apple, Orange, Pear
  ```
* **.eq( i ):** Reduce the set of matched elements to the one at the specified index. Use .eq(-i) to count backwards from the last selected element.
  ```js
  $('li').eq(0).text() //=> Apple
  $('li').eq(-1).text() //=> Pear
  ```

* Example
  ```html
  <ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
  </ul>
  ```
  ```js
  $('.apple', '#fruits').text() //=> Apple
  $('ul .pear').attr('class') //=> pear
  $('li[class=orange]').html() //=> Orange
  $('ul').attr('id') //=> fruits
  $('.apple').attr('id', 'favorite').html() //=> <li class="apple" id="favorite">Apple</li>
  $('input[type="checkbox"]').prop('checked') //=> false
  $('input[type="checkbox"]').prop('checked', true).val() //=> ok
  $('<div data-apple-color="red"></div>').data() //=> { appleColor: 'red' }
  $('<div data-apple-color="red"></div>').data('apple-color') //=> 'red'
  $('input[type="text"]').val() //=> input_text
  $('input[type="text"]').val('test').html() //=> <input type="text" value="test"/>
  $('#fruits').find('li').length //=> 3
  $('.pear').parent().attr('id') //=> fruits
  $('.orange').parents().length // => 2
  $('.orange').parents('#fruits').length // => 1
  $('.orange').closest() // => []
  $('.orange').closest('.apple') // => []
  $('.orange').closest('li') // => [<li class="orange">Orange</li>]
  $('.orange').closest('#fruits') // => [<ul id="fruits"> ... </ul>]
  $('.apple').next().hasClass('orange') //=> true
  $('.apple').nextAll() //=> [<li class="orange">Orange</li>, <li class="pear">Pear</li>]
  $('.pear').siblings().length //=> 2
  $('.pear').siblings('.orange').length //=> 1
  $('#fruits').children().length //=> 3
  $('#fruits').children('.pear').text() //=> Pear
  ```