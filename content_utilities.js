function ScrapReviews() {
	var review = [];
	$(".infosite-section-content").not('[id*="lblContent"]').each(function(index, element) {	
		var rev = $.trim(element.innerHTML);
		if (rev.length > 0) { 
			review.push(rev);
		}
	});
	return review;
}

function callIBMWatson(reviewsList) {

	var review = getCombinedReviews(reviewsList);

	console.log("Review which will be sent" + review);
	console.log("Enconded review : ", encodeURIComponent(review));

	var settings = {
		//url: 'https://gateway-a.watsonplatform.net/calls/text/TextGetCombinedData?text=' + encodeURIComponent(review) + '&outputMode=json&extract=doc-sentiment,doc-emotion&maxRetrieve=3&apikey=323992997e3d6872f55b7b495d1e7c8852db6e74',
		url: 'https://localhost:8090/ibmDummyData',
		type: 'GET',
		dataType: 'json',
	};
	return settings;
}

function getReviewSummaryTab() {
	var summaryTab = "<li role='presentation' class='tab'>" + 
              "<a href='#section-summary-reviews' role='tab' id='tab-summary-reviews' aria-controls='section-reviews' data-tab='7' aria-selected='false'><span class='tab-label'>Summary Reviews</span></a>" + 
            "</li>"
    return summaryTab;
}

function GetModalSummaryNode(closeBtLink, thumbNailLink) {
	var modalNode = "<div id='section-summary-reviews'>" + 
"            <div id='btn-close-modal' class='close-section-summary-reviews'> " + 
"                <img class='closebt' src='" + closeBtLink+ "'>" + 
"            </div>" + 
"            <div id='modal-container'>" +
"				<div class='row'> " +  
"					<div class='col-md-2'>" +
"						<img id = 'reviewsmiley' class='img-responsive' alt='Responsive image'> " +
"          			</div>" + 
"					<div class='col-md-10' id='summaryReviews' style='position: fixed; width: 100%; height: 100%; margin-left: 200px'> " + 
"          			</div>" + 
"          		</div>" + 
"				<div class='row'> " +  
"					<div class='col-md-4' id='emotionbreakup'> " +
"          			</div>" + 
"					<div class='col-md-4'>" +
"          			</div>" + 
"					<div class='col-md-4'>" +
"          			</div>" + 
"          		</div>" + 
" 			 </div>";

return modalNode;
}

function getCombinedReviews(reviewsList) {
	var review = "";
	for(i = 0; i< reviewsList.length; i++) {
		review += reviewsList[i] + " ";
	}
	return review;
}

function GetSummarizeAPISettings(reviewsList) {

	var reviewsCombined = getCombinedReviews(reviewsList);

	var node = new Object();
	node.key = "INPUT";
	node.value = reviewsCombined;
	
	var settings = {
		url: 'https://localhost:8090/summarizedummy',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(node),
		crossDomain: true,
		contentType:'application/json',
		accept: 'applciation/json'
	}
	return settings;
}

function getShortenURL(longUrl) {
	
	var url = 'https://www.googleapis.com/urlshortener/v1/url';
	var key = 'AIzaSyCmN5_GBbpl1HY2cpYeFQxYAezI2dap5YA';
	var urlComplete = url;
	urlComplete += '?key=' + key;

	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', urlComplete, false);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');

	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status != 0) 
		{
			var response = JSON.parse(xmlhttp.responseText);

			if(response.id == undefined)
			{
				if(response.error.code == '401')
					console.log("Error2");
			}
			else	
			{
				console.log("Success2");
			}
		}
	}
	var longUrl = longUrl;
	xmlhttp.send(JSON.stringify({'longUrl': longUrl}));	
	var myArr = JSON.parse(xmlhttp.responseText);
	
	return myArr.id;
}  

function PostOnTwitter(shortURL, userData) {
	var data = [];

	var usernode = new Object();
	usernode.key = "UserData";
	usernode.value = userData;
	data.push(usernode);

	var urlnode = new Object();
	urlnode.key = "Url";
	urlnode.value = shortURL;
	data.push(urlnode);

	console.log("Final Data" + JSON.stringify(data));

	var settings = {
		url: 'https://localhost:8090/tweet',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(data),
		crossDomain: true,
		contentType:'application/json',
		accept: 'application/json'
	};
	return settings;
}
