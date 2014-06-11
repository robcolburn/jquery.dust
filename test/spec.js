describe("jQuery Dust", function(){
	beforeEach(function () {
		jQuery('body').append('<div id="temp" />');
	});
	afterEach(function () {
		jQuery('#temp').remove();
	});
	it("Example 1 works as expected", function (done) {
		jQuery('#temp').append(
			'<div id="cat-stuff"></div>' +
			'<div id="dog-stuff"></div>' +
			'<div id="plant-stuff"></div>'
		);
		var promises = [
			new jQuery.Deferred(),
			new jQuery.Deferred(),
			new jQuery.Deferred()
		];
		dust.render('cute-cat', cats, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#cat-stuff').html(out);
			promises[0].resolve();
		});
		dust.render('big-bad-dog', dogs, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#dog-stuff').html(out);
			promises[1].resolve();
		});
		dust.render('planty', plants, function (err, out) {
			if (err) {
				return console.error(err);
			}
			$('#plant-stuff').html(out);
			promises[2].resolve();
		});
		$.when(promises).done(function () {
			// validate template
			done();
		});
	});


	it("Example 2 works as expected", function (done) {
		jQuery('#temp').append(
			'<div id="cat-stuff" data-dust-template="cute-cat"></div>' +
			'<div id="dog-stuff" data-dust-template="big-bad-dog"></div>' +
			'<div id="plant-stuff" data-dust-template="planty"></div>'
		);
		var promises = [
			$('#cat-stuff').dustTemplate(cats),
			$('#dog-stuff').dustTemplate(dogs),
			$('#plant-stuff').dustTemplate(plants)
		];
		$.when(promises).done(function () {
			// validate template
			done();
		});
	});

	it("Example 3 works as expected", function (done) {
		jQuery('#temp').append(
			'<div class="thing" data-dust-template="cute-cat"></div>' +
			'<div class="thing" data-dust-template="big-bad-dog"></div>' +
			'<div class="thing" data-dust-template="planty"></div>'
		);
		$('.thing').dustTemplate(bigDataObject)
			.done(promises, function () {
				// validate template
				done();
			});
	});

	it("Example 4 works as expected", function (done) {
		jQuery('#temp').append(
			'<div class="thing" data-dust-template="cute-cat"></div>' +
			'<div class="thing" data-dust-template="big-bad-dog"></div>' +
			'<div class="thing" data-dust-template="planty"></div>'
		);
		$('.thing')
			.dustTemplate(bigDataObject)
			.done(function ($cat, $dog, $planty) {
				$cat.show();
				$dog.slideUp();
				$planty.fadeIn();
			})
			.done(function () {
				// validate template
				done();
			});
	});
});