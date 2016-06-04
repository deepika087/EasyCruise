$(document).ready(function(){

	/**
		These div ids and class will stop extra pop ups on Harvard business review website
	**/
	var url = document.URL;
	var searchPagePattern = "section-reviews";
    var travelerSelectionPage = "adultCount";

	if (url.search(searchPagePattern) > 0) {
		
		var summaryModalNode = GetModalSummaryNode(chrome.extension.getURL("img/closebt.svg"), chrome.extension.getURL("img/thumbnail.svg")) ;
		$(".wrap.cf.layout-1col-a.overwritebody").append( summaryModalNode );

		//Add CSS for Close-Button
		$("#btn-close-modal").css({
			"width" : "100%",
            "text-align" : "center",
            "cursor" : "pointer",
            "color" : "#fff"
		});
		$(".tabs.cf").append(getReviewSummaryTab());

		$("#tab-summary-reviews").animatedModal({
            modalTarget:'section-summary-reviews',
            animatedIn:'lightSpeedIn',
            animatedOut:'bounceOutDown',
            color:'#3498db',
            // Callbacks
            beforeOpen: function() {
                //1. Scrap reviews
                var reviewsList = ScrapReviews();
                var reviewsCombined = getCombinedReviews(reviewsList);

                //2. Send the reviews for summary
                var summarizeAPI = GetSummarizeAPISettings(reviewsList);
                $.ajax(summarizeAPI).done(function(data) {

                    $('#reviewsmiley').attr( "src", chrome.extension.getURL("img/happysmiley.png") );
                    $("#summaryReviews").append('<span class="element"></span>');
                    $(".element").typed({
                        strings: ["<b>Summary ^2000</b>", data.value],
                        contentType: 'html',
                        typeSpeed: 0
                    });
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
					console.log("Something wrong with summarize API" + textStatus + "," + errorThrown + "," + jqXHR.responseText);
				});
                
                //3. Send that list to IBM for analytics
                IBMDataSettings = callIBMWatson(reviewsList);	
                $.ajax(IBMDataSettings).done(function(data) {
                    console.log("success" + JSON.stringify(data) + "Emotion only : " , JSON.stringify(data.docEmotions));
                    //TODO: Create charts + Most talked words
                    
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("Something wrong with IBM Analyitcs API" + textStatus + "," + errorThrown + "," + jqXHR.responseText);
                });
            },           
            afterOpen: function() {
                //console.log("The animation is completed");
            }, 
            beforeClose: function() {
                //console.log("The animation was called");
            }, 
            afterClose: function() {
                //console.log("The animation is completed");
            }
        });
	} //End of Review Block

    //Start of checkout Page block
    else if (url.search(travelerSelectionPage) > 0) {
        console.log("found travelerSelectionPage page");

        $("body").append("<div id='feedbackbox'></div>");
        var url_path = chrome.extension.getURL("img/tweet-this.png");
        $("#feedbackbox").css({backgroundImage : 'url(' + url_path + ')'});
        $("#feedbackbox").click(function(event) {

           var bk = "<div id='myNotesArea'><textarea id='myNotes' class='test' placeholder='Tweet about your trip...''></textarea></div>";
           $("#feedbackbox").append(bk);
           $(this).unbind('click'); 
        });
        $("#feedbackbox").focusout(function(event) {
            //1. Get URL Shortner
            shortURL = getShortenURL(url);

            //2. Call Twitter API to sav
            var twitterSettings = PostOnTwitter(shortURL, $('#myNotes').val());
            $.ajax(twitterSettings).done(function(data) {
                console.log("success" + JSON.stringify(data) );
                
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(">Something wrong with Twitter API" + textStatus + "," + errorThrown + "," + jqXHR.responseText);
            });
        });
    }//End of checkout page block 
    else {
        console.log('Nothing matched ! ! ');
    }
}); //end of dument.ready
