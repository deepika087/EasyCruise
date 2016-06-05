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

	var settings = {
		//url: 'https://gateway-a.watsonplatform.net/calls/text/TextGetCombinedData?text=' + encodeURIComponent(review) + '&outputMode=json&extract=doc-sentiment,doc-emotion,keywords&maxRetrieve=7&sentiment=1&apikey=323992997e3d6872f55b7b495d1e7c8852db6e74',
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
"					<div class='col-md-10' style='position: fixed; width: 100%; height: 100%; margin-left: 200px'> " + 
"						<br /><br /><br /><br />" +
"          			</div>" +  
"          		</div>" + 
"				<div class='row'> " +  
"					<div class='col-md-4' > " +
"          			</div>" + 
"					<div class='col-md-4' id='freqWords' style='position: fixed; width: 100%; height: 100%; margin-left: 200px';>" +
"          			</div>" + 
"					<div class='col-md-4' style='position: fixed; width: 100%; height: 100%; margin-left: 400px'>" +
" 						<div id='pieChart' style='margin-top: -10px'></div> " +
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
		url: 'https://localhost:8090/summarizedummy', //TODO: change the location
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

function getMostFrequentlyUsedWordSet(keywordList) {
	var result = "";
	for (i = 0, len = keywordList.length; i < len; i++) {
      e=keywordList[i];
      if ( parseFloat(e.sentiment.score) >= 0.51 && parseFloat(e.relevance) >= 0.51) {
      	result += "<h4>" + "<img align='left' src= '" + chrome.extension.getURL("img/arrow_up.svg") + "' class='img-responsive' alt='Responsive image' height='20' width='20' >" + e.text + "</h4>";
      } else {
      	result += "<h4>" + "<img align='left' src= '" + chrome.extension.getURL("img/arrow_down.svg") + "' class='img-responsive' alt='Responsive image' height='20' width='20'>" + e.text + "</h4>";
      }
    }
    return result;
}

function injectChart(docEmotions) {

	var pie = new d3pie("pieChart", {
		"size": {
			
			"pieOuterRadius": "70%"
		},
		"data": {
			"sortOrder": "value-desc",	
			"content": [
				{
					"label": "Anger",
					"value": parseFloat (docEmotions.anger) * 100,
					"color": "#2484c1"
				},
				{
					"label": "Disgust",
					"value": parseFloat (docEmotions.disgust) * 100,
					"color": "#ff0000"
				},
				{
					"label": "Fear",
					"value": parseFloat (docEmotions.fear) * 100,
					"color": "#4daa4b"
				},
				{
					"label": "Joy",
					"value": parseFloat (docEmotions.joy) * 100,
					"color": "#90c469"
				},
				{
					"label": "Sadness",
					"value": parseFloat (docEmotions.sadness) * 100,
					"color": "#daca61"
				}
			]
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"mainLabel": {
				"fontSize": 11
			},
			"percentage": {
				"color": "#ffffff",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 15
			},
			"lines": {
				"enabled": true
			},
			"truncation": {
				"enabled": true
			}
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "linear",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"gradient": {
				"enabled": true,
				"percentage": 100
			}
		}
	});
}