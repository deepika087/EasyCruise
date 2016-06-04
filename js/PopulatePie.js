function populatePie() {
	//console.log(">Received request for ", );
	
	var settings = {
    "header": {
      "title": {
        "text": "Reasons for choosing other websites",
        "fontSize": 24,
        "font": "open sans"
      },
      "titleSubtitlePadding": 9
    },
    "footer": {
      "color": "#999999",
      "fontSize": 10,
      "font": "open sans",
      "location": "bottom-left"
    },
    "size": {
      "canvasWidth": 590,
      "pieOuterRadius": "90%"
    },
    "data": {
      "sortOrder": "value-desc",
      "content": [
        {
          "label": "label1",
          "value": 20,
          "color": "#2484c1"
        },
        {
          "label": "label2",
          "value": 10,
          "color": "#66ff66"
        },
        {
          "label": "label3",
          "value": 30,
          "color": "#ff66cc"
        },
        {
          "label": "label4",
          "value": 25,
          "color": "#0066ff"
        },
        {
          "label": "label5",
          "value": 25,
          "color": "#ff0000"
        }
        
      ]
    },
    "labels": {
      "outer": {
        "pieDistance": 32
      },
      "inner": {
        "hideWhenLessThanPercentage": 3
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
        "fontSize": 11
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
  }
	return settings;
}
