/**
 * gsCachinate
 *
 * Summary:
 *    Cross between pagination and caching. On load an ajax request
 *    will be made to fetch the next chunk of data.  If data is obtained
 *    a link will be added below the table that is acting as the data 
 *    containing element. Once the data is added to the table an additional
 *    request will be made to retrieve the data for the next page.
 *
 * Created By:
 *    Chris Olsen
 */
(function($) {

  var gsCachinateOptions;

  $.fn.gsCachinate = function(options) {
    
    var defaultOptions = {
      noDataMessage: "",
      nextPageLinkText: "View More",
      queryStringKey: "page",
      animate: false
    };
    
    options = options == null ? {} : options;
    gsCachinateOptions = $.extend(defaultOptions, options);

    return this.each(function() {
      getNextPage(1, $(this));
    })
  }

  /**
   * Recursive method that caches the next page of data and 
   * adds it to the specified element when the user chooses
   * to view more
   */
  function getNextPage(currentPage, dataElement) {
   
    // ajax request
    $.get(getUrl(currentPage + 1), function(data) {
      
      var viewMoreId = 'gs-view-more';
      var link;

      // Show or hide the data bases on whether more data (non-whitespace) exists
      if (data.replace(/\s/g, "").length == 0) {
        $("a#" + viewMoreId).remove();
        dataElement.after("<div id='gs-no-data'>"+gsCachinateOptions["noDataMessage"]+"</div>");
      }
      else {
        // create or obtain the existing link to view the next page
        if ($("a#" + viewMoreId).length == 0) {
          // ie won't allow text to be set via .text() method 
          var linkText = gsCachinateOptions["nextPageLinkText"];
          var linkWrapper = $('<div id="gs-view-more-wrapper"></div>');
					
          link = $("<a href='#'>"+ linkText +"</a>")
            			.attr("id", viewMoreId)
									.attr("href", getUrl(currentPage + 1))
									.hide();

          linkWrapper.append(link).insertAfter(dataElement);
        }
        else {
          link = $("a#" + viewMoreId);
        }

				// ensure the link is visible since it is hidden when it is clicked
				$("a#" + viewMoreId).fadeIn();

        // display the cached data to the user and
        // rebind the link to get the next set of data 
        link.one("click", function() {
          if ( gsCachinateOptions["animate"] ) {
						// append data with animation
            var jdata = $(data);
            jdata.css("display", "none");
            dataElement.append(jdata)
            jdata.slideDown();

						// update link
						$("a#" + viewMoreId)
							.attr("href", getUrl(currentPage + 2)) /* update link href for testing purposes */
							.fadeOut(); /* hide the View More link until we are sure there is more data */
          }
          else {
            dataElement.append(data);
          }

					// notify any listeners to the ids that have been added
					ids = jQuery.map($(data), function(n) { return n.id }).join(",");
					dataElement.trigger("after_show_next_page", ids);

					// make request for next page
          getNextPage(currentPage + 1, dataElement);

          return false;
        });

        // dataElemet => initial object plugin called on
        dataElement.trigger("after_cachinate");
        
      } // if
    }) // get

		function getUrl(page) {
			var urlBase = document.location.href;

			if (urlBase.indexOf("?") > -1)
			  urlBase += "&"+gsCachinateOptions["queryStringKey"]+"=";
			else
			  urlBase += "?"+gsCachinateOptions["queryStringKey"]+"=";
				
			return urlBase + page
		}

  } // function

})(jQuery);
