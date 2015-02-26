var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Set locals
	locals.section = 'listings';
	locals.filters = {
		listing: req.params.listing
	};
	locals.data = {
		listings: []
	};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Listing').model.findOne({
			state: 'published',
			slug: locals.filters.listing
		}).populate('author categories');

		q.exec(function(err, result) {
			locals.data.listing = result;
			next(err);
		});

	});

	// Load other listings
	view.on('init', function(next) {

		var q = keystone.list('Listing').paginate().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function(err, results) {
			console.log(results);
			locals.data.listings = results;
			next(err);
		});

	});

	// Render the view
	view.render('listing');

};
