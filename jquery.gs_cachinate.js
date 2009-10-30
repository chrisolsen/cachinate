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

  var gsCachinateOptions

  $.fn.gsCachinate = function(options) {
    
    var defaultOptions = {
      noDataMessage: "",
      nextPageLinkText: "View More",
      queryStringKey: "page"
    }
    
    options = options == null ? {} : options
    gsCachinateOptions = $.extend(defaultOptions, options)

    return this.each(function() {
      getNextPage(1, $(this))
    })
  }

  /**
   * Recursive method that caches the next page of data and 
   * adds it to the specified element when the user chooses
   * to view more
   */
  function getNextPage(currentPage, dataElement) {
    var urlBase = document.location.href
    if (urlBase.indexOf("?") > -1)
      urlBase += "&"+gsCachinateOptions["queryStringKey"]+"=" 
    else
      urlBase += "?"+gsCachinateOptions["queryStringKey"]+"="

    // ajax request
    $.get(urlBase + (currentPage + 1), function(data) {
      
      var viewMoreId = 'gs-view-more'
      var link

      // Show or hide the data bases on whether more data (non-whitespace) exists
      if (data.replace(/\s/g, "").length == 0) {
        $("a#" + viewMoreId).remove()
        dataElement.after("<div id='gs-no-data'>"+gsCachinateOptions["noDataMessage"]+"</div>")
      }
      else {
        // create or obtain the existing link to view the next page
        if ($("a#" + viewMoreId).length == 0) {
          var linkText = $.browser.msie ? "View More" : ""
          link = $("<a href='#'>"+ linkText +"</a>")
            .attr("id", viewMoreId)
            .text(gsCachinateOptions["nextPageLinkText"])
            .insertAfter(dataElement)
        }
        else {
          link = $("a#" + viewMoreId)
        }

        // display the cached data to the user and
        // rebind the link to get the next set of data 
        link.one("click", function() {
          dataElement.append(data) 
          getNextPage(currentPage + 1, dataElement)

          return false
        })

      } // if
    }) // get
  } // function

})(jQuery);
