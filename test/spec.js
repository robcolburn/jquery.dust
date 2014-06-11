/*jshint expr:true*/
$(function($){
$('body').append('<div id="temp" />');
describe("jquery.dust", function(){
	afterEach(function () {
		$('#temp').empty();
		dust.cache = {};
	});

	// Notice that each of these test cases are copy/paste from README
	// That is very intentional :-)

	var initialHTML = multiline(function(){/*
		<div id="cat-stuff"></div>
		<div id="dog-stuff"></div>
		<div id="plant-stuff"></div>
		<script id="cute-cat" type="text/dust-template">
			<div class="cute-cat">
				<div class="name">{name}</div>
				{#feet}<span class="foot"/>{/feet}
			</div>
		</script>
		<script id="big-bad-dog" type="text/dust-template">
			<div class="dog">
				<div class="name">{name}</div>
				{#feet}<span class="foot"/>{/feet}
			</div>
		</script>
		<script id="planty" type="text/dust-template">
			<div class="plant">
				<div class="name">{name}</div>
			</div>
		</script>
	*/});

	it('Before Code: Some placeholders and some templates', function (done) {
		$('#temp').html(initialHTML);
		// Data
		var stuff = {
			cat: {name: 'fluffy', feet: [1,1,1,1]},
			dog: {name: 'fred', feet: [1,1,1,1]},
			plant: {name: 'bob'}
		};

		// Templates
		dust.compileFn($('#cute-cat').html(), 'cute-cat');
		dust.compileFn($('#big-bad-dog').html(), 'big-bad-dog');
		dust.compileFn($('#planty').html(), 'planty');

		// Async counting
		var pending = 3;
		function checkIn () {
			if (!(--pending)) {
				finished();
			}
		}

		// Render
		dust.render('cute-cat', stuff.cat, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#cat-stuff').html(out);
			checkIn();
		});
		dust.render('big-bad-dog', stuff.dog, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#dog-stuff').html(out);
			checkIn();
		});
		dust.render('planty', stuff.plant, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#plant-stuff').html(out);
			checkIn();
		});
		function finished () {
			$('#cat-stuff .name').text().should.not.be.empty;
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});



	it('Example 1: Single-line declarations, auto-compilation, promises.', function (done) {
		$('#temp').html(initialHTML);
		// Data
		var stuff = {
			cat: {name: 'fluffy', feet: [1,1,1,1]},
			dog: {name: 'fred', feet: [1,1,1,1]},
			plant: {name: 'bob'}
		};

		// Templates
		$.dust.compile();

		// Async counting
		var pending = 3;
		function checkIn () {
			if (!(--pending)) {
				finished();
			}
		}

		// Render
		$('#cat-stuff').dust('cute-cat', stuff.cat).done(checkIn);
		$('#dog-stuff').dust('big-bad-dog', stuff.dog).done(checkIn);
		$('#plant-stuff').dust('planty', stuff.plant).done(checkIn);

		function finished () {
			$('#cat-stuff .name').text().should.equal('fluffy');
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});



	it('Example 2: Collect promises with $.when', function (done) {
		$('#temp').html(initialHTML);
		// Data
		var stuff = {
			cat: {name: 'fluffy', feet: [1,1,1,1]},
			dog: {name: 'fred', feet: [1,1,1,1]},
			plant: {name: 'bob'}
		};

		// Templates
		$.dust.compile();

		// Render
		$.when(
			$('#cat-stuff').dust('cute-cat', stuff.cat),
			$('#dog-stuff').dust('big-bad-dog', stuff.dog),
			$('#plant-stuff').dust('planty', stuff.plant)
		).done(finished);

		function finished () {
			$('#cat-stuff .name').text().should.equal('fluffy');
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});

	it('Example 3: Declare templates in markup', function (done) {
		$('#temp').html(multiline(function(){/*
		<div id="cat-stuff" data-dust-template="cute-cat"></div>
		<div id="dog-stuff" data-dust-template="big-bad-dog"></div>
		<div id="plant-stuff" data-dust-template="plant"></div>
		<script id="cute-cat" type="text/dust-template">
			<div class="cute-cat">
				<div class="name">{name}</div>
				{#feet}<span class="foot"/>{/feet}
			</div>
		</script>
		<script id="big-bad-dog" type="text/dust-template">
			<div class="dog">
				<div class="name">{name}</div>
				{#feet}<span class="foot"/>{/feet}
			</div>
		</script>
		<script id="plant" type="text/dust-template">
			<div class="plant">
				<div class="name">{name}</div>
			</div>
		</script>
		*/}));

		// Data
		var stuff = {
			cat: {name: 'fluffy', feet: [1,1,1,1]},
			dog: {name: 'fred', feet: [1,1,1,1]},
			plant: {name: 'bob'}
		};

		// Templates
		$.dust.compile();

		// Render
		$.when(
			$('#cat-stuff').dust(stuff.cat),
			$('#dog-stuff').dust(stuff.dog),
			$('#plant-stuff').dust(stuff.plant)
		).done(finished);

		function finished () {
			$('#cat-stuff .name').text().should.equal('fluffy');
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});


	it('Example 4: Several at once', function (done) {
		$('#temp').html(multiline(function(){/*
		<div id="cat-stuff" class="stuff" data-dust-template="cute-cat"></div>
		<div id="dog-stuff" class="stuff" data-dust-template="big-bad-dog"></div>
		<div id="plant-stuff" class="stuff" data-dust-template="plant"></div>
		<script id="cute-cat" type="text/dust-template">
			<div class="cute-cat">
				<div class="name">{cat.name}</div>
				{#cat.feet}<span class="foot"/>{/cat.feet}
			</div>
		</script>
		<script id="big-bad-dog" type="text/dust-template">
			<div class="dog">
				<div class="name">{dog.name}</div>
				{#dog.feet}<span class="foot"/>{/dog.feet}
			</div>
		</script>
		<script id="plant" type="text/dust-template">
			<div class="plant">
				<div class="name">{plant.name}</div>
			</div>
		</script>
		*/}));
		var stuff = {
			cat: {name: 'fluffy', feet: [1,1,1,1]},
			dog: {name: 'fred', feet: [1,1,1,1]},
			plant: {name: 'bob'}
		};
		$.dust.compile();
		$('.stuff').dust(stuff).done(finished);

		function finished () {
			$('#cat-stuff .name').text().should.equal('fluffy');
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});



	it('Example 5: Sets of data at once', function (done) {
		$('#temp').html(multiline(function(){/*
		<div class="cat" data-dust-template="cute-cat"></div>
		<div class="cat" data-dust-template="cute-cat"></div>
		<div class="cat" data-dust-template="cute-cat"></div>
		<script id="cute-cat" type="text/dust-template">
			<div class="cute-cat">
				<div class="name">{name}</div>
				{#feet}<span class="foot"/>{/feet}
			</div>
		</script>
		*/}));

		// Data
		var cats = [
			{name: 'fluffy', feet: [1,1,1,1]},
			{name: 'fred', feet: [1,1,1,1]},
			{name: 'bob'}
		];

		// Pick up templates from DOM
		$.dust.compile();

		// Render
		$('.cat').dust(function (index) {
			return cats[index];
		}).done(finished);

		function finished () {
			$('.cat:eq(0) .name').text().should.equal('fluffy');
			$('.cat:eq(1) .foot').should.have.length(4);
			$('.cat:eq(2) .name').text().should.equal('bob');
			done();
		}
	});




	it('Example 6: Promises, promises', function (done) {
		$('#temp').html(multiline(function(){/*
			<div id="cat-stuff" class="stuff" data-dust-template="cute-cat"></div>
			<div id="dog-stuff" class="stuff" data-dust-template="big-bad-dog"></div>
			<div id="plant-stuff" class="stuff" data-dust-template="plant"></div>
			<script id="cute-cat" type="text/dust-template">
				<div class="cute-cat">
					<div class="name">{cat.name}</div>
					{#cat.feet}<span class="foot"/>{/cat.feet}
				</div>
			</script>
			<script id="big-bad-dog" type="text/dust-template">
				<div class="dog">
					<div class="name">{dog.name}</div>
					{#dog.feet}<span class="foot"/>{/dog.feet}
				</div>
			</script>
			<script id="plant" type="text/dust-template">
				<div class="plant">
					<div class="name">{plant.name}</div>
				</div>
			</script>
		*/}));

		var willBeStuff = (function () {
			var promise = new $.Deferred();
			setTimeout(function () {
				promise.resolve({
					cat: {name: 'fluffy', feet: [1,1,1,1]},
					dog: {name: 'fred', feet: [1,1,1,1]},
					plant: {name: 'bob'}
				});
			}, 10);
			return promise;
		});

		$.dust.compile();
		$('.stuff').dust(willBeStuff).done(finished);

		function finished (arg) {
			$('#cat-stuff .name').text().should.equal('fluffy');
			$('#dog-stuff .foot').should.have.length(4);
			$('#plant-stuff .name').text().should.equal('bob');
			done();
		}
	});

});
});