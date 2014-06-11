/**
 * A simple wrapper around dust to easily integrate with jQuery
 */
/*global jQuery, dust*/
(function ($) {
  /**
   * Render a dust template to the current element
   *
   * @param {string} template (optional)
   *   Name of the dust template to use.
   *   If skipped, will use this parameter as data, and
   *      will attempt to use data attribute if not specified.
   * @param {object|function} data
   *   An object to pass to dust template function
   *   If a function is passed
   *     The function will be called on each element in the set
   *     with the element as context, and the index as an argument
   *   Finally, attempt to parse data attributes if data not specified
   */
  $.fn.dust = function (templateName, data) {
    if (arguments.length === 1) {
      data = templateName;
      templateName = false;
    }
    return $.extend(this, $.when(
      this.map(function (index, domElement) {
        return $.dust(domElement,
          templateName || $(domElement).data('dust-template'),
          ($.isFunction(data) ? data.call(domElement, index) : (data || $(domElement).data()))
        );
      }).get()
    ));
  };

  $.fn.dust_compile = function (templateName) {
    return this.each(function () {
      dust.compileFn($(this).html(), templateName || $(this).attr('id'));
    });
  };

  /**
   * Render a Dust template to a particular element
   *
   * @param {selector} element
   *   A jQuery Selector to apply templated data to
   * @param {string} templateName
   *   Name of the dust template to render
   * @param {object} templateData
   *   Data to pass to dust template
   * @return {jQuery.Deferred}
   *   Promise resolved with the element has rendered with the element
   */
  $.dust = function (element, templateName, templateData) {
    var deferred = new $.Deferred();
    dust.render(templateName, templateData, function (err, out) {
      if (err) {
        return deferred.reject(err.message);
      }
      else {
        deferred.resolve($(element).html(out));
      }
    });
    return deferred;
  };

  $.dust.compile = function () {
    $('script[type="text/dust-template"][id]').dust_compile();
  };

}(jQuery));