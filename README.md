jQuery.dustTemplate
===========================

Todo
------
* [ ] Make up some templates and sample data
* [ ] Make tests pass

A simple wrapper library around [dust-js](http://akdubya.github.io/dustjs/) for [jQuery](http://jquery.com/).


Perhaps this is your code now…

```html
<div id="cat-stuff"></div>
<div id="dog-stuff"></div>
<div id="plant-stuff"></div>
```

```js
dust.render('cute-cat', cats, function (err, out) {
	if (err) {
		return console.error(err);
	}
	$('#cat-stuff').html(out);
});
dust.render('big-bad-dog', dogs, function (err, out) {
	if (err) {
		return console.error(err);
	}
	$('#dog-stuff').html(out);
});
dust.render('planty', plants, function (err, out) {
	if (err) {
		return console.error(err);
	}
	$('#plant-stuff').html(out);
});
```

Sure, that works, but is it pretty?  We like to write pretty jQuery code.

### Example 1: Single line declarations

```js
$('#cat-stuff').dustTemplate('cute-cat', cats);
$('#dog-stuff').dustTemplate('big-bad-dog', dogs);
$('#plant-stuff').dustTemplate('planty', plants);
```

### Example 2: Specify templates in markup

```html
<div id="cat-stuff" data-dust-template="cute-cat"></div>
<div id="dog-stuff" data-dust-template="big-bad-dog"></div>
<div id="plant-stuff" data-dust-template="planty"></div>
```

```js
$('#cat-stuff').dustTemplate(cats);
$('#dog-stuff').dustTemplate(dogs);
$('#plant-stuff').dustTemplate(plants);
```

### Example 3: Aply one big data object to a bunch of things.

```html
<div class="thing" data-dust-template="cute-cat"></div>
<div class="thing" data-dust-template="big-bad-dog"></div>
<div class="thing" data-dust-template="planty"></div>
```

```js
$('.thing').dustTemplate(bigDataObject);
```

### Example 4: Know when things are finished


```html
<div class="thing" data-dust-template="cute-cat"></div>
<div class="thing" data-dust-template="big-bad-dog"></div>
<div class="thing" data-dust-template="planty"></div>
```

```js
$('.thing').dustTemplate(bigDataObject).done(function ($cat, $dog, $planty) {
	$cat.show();
	$dog.slideUp();
	$planty.fadeIn();
});
```
