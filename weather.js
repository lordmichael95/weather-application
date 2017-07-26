/* code that runs when Web page is first loaded and rendered by the browser */
var left = 0;
var MARGIN_LEFT = 12;
var	NUM_OF_DAYS = 10;		//numbers of days that program will fetch from Yahoo!

//counts how many times the days have been "added" or "subtracted" from the standard 5 day forecast.
//If 0, showing basic 5 day forecast. If any other positive number up to 5, then user is checking the extend forecast
var numberOfDaysWeatherBarHasMoved = 0;

/*
forecastMovable will move right, allowing for a previous day's forecast to popup.
*/
function buttonActionLeft() {
    var steppy = document.getElementById("forecastMovable");
    steppy.style.left = left+"px";

	var container = steppy.parentElement;
    var obj = document.getElementById("box0");

    /*getting width value of one box plus margin-left of box1*/
    var boxWidth = obj.clientWidth + MARGIN_LEFT;

	//left most limit of forecastMovable
	if(numberOfDaysWeatherBarHasMoved !== 0){
			left = left + boxWidth;
            steppy.style.left = left+"px";
            numberOfDaysWeatherBarHasMoved = numberOfDaysWeatherBarHasMoved - 1;
    }
}

function buttonActionRight() {
    var steppy = document.getElementById("forecastMovable");
    steppy.style.left = left+"px";

    var container = steppy.parentElement;
	var obj = document.getElementById("box0");

    /*getting width value of one box plus margin-left of box1*/
    var boxWidth = obj.clientWidth + MARGIN_LEFT;

    //right most limit of forecastMovable
	if(numberOfDaysWeatherBarHasMoved !== 5){
            left = left - boxWidth;
            steppy.style.left = left+"px";
            numberOfDaysWeatherBarHasMoved = numberOfDaysWeatherBarHasMoved + 1;
	}


}

//returns the path of a picture based on Yahoo!'s API code for pictures
function getPicturePath(picCode, idTag){
	if(picCode == 26 || picCode == 27 || picCode == 28){		//cloudy
		document.getElementById(idTag).src = "WeatherApp 3/cloudy.png";
	}else if(picCode == 32 || picCode == 34 || picCode == 36){	//sunny
		document.getElementById(idTag).src = "WeatherApp 3/sunny.png";
	}else if(picCode == 11 || picCode == 12){					//rain
		document.getElementById(idTag).src = "WeatherApp 3/rain.png";
	}else if(  picCode == 3 ||picCode == 4 || picCode == 37 || picCode == 38 || picCode == 39 || picCode == 47){		//thunderstorms
        document.getElementById(idTag).src = "WeatherApp 3/thunder.png";
	}else if(picCode == 29 || picCode == 30 || picCode == 44){	//partly sunny
		document.getElementById(idTag).src = "WeatherApp 3/part-sun.png";
	}else{														//snow
		document.getElementById(idTag).src = "WeatherApp 3/snow.png";
	}
}

//called when button is pushed
function getNewPlace(){
	// get what the user put into the textbox
	var newPlace = document.getElementById("zipcodeBox").value;

	// make a new script element
	var script = document.createElement("script");

	// start making the complicated URL
	script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+newPlace+"')&format=json&callback=callbackFunction"
	script.id = "jsonpCall";

	// remove old script
	var oldScript = document.getElementById("jsonpCall");
	if (oldScript != null) {
		document.body.removeChild(oldScript);
	}

	// put new script into DOM at bottom of body
	document.body.appendChild(script);
}


/* called when new weather arrives */
function callbackFunction(weatherObjectData) {
	json = '{weatherObjectData}';
	
	var timey = document.getElementById("timey");
	timey.textContent = JSON.stringify(weatherObjectData.query.results.channel.lastBuildDate);
	timey.textContent = timey.textContent.substr(18, 9);
	
	var date = document.getElementById("date");
	date.textContent = JSON.stringify(weatherObjectData.query.results.channel.item.condition.date);
	date.textContent = date.textContent.substr(5, 12);
	
	var city = document.getElementById("city");
	city.textContent = JSON.stringify(weatherObjectData.query.results.channel.location.city);
	city.textContent = city.textContent.substr(1, city.textContent.length - 2);
	
	var region = document.getElementById("region");
	region.textContent = JSON.stringify(weatherObjectData.query.results.channel.location.region);
	region.textContent = region.textContent.substr(1, region.textContent.length - 2);
	
	var currentTemp = document.getElementById("currentTemp");
	currentTemp.textContent = JSON.stringify(weatherObjectData.query.results.channel.item.condition.temp);
	currentTemp.textContent = currentTemp.textContent.substr(1, currentTemp.textContent.length - 2);
	
	var tempSystem = document.getElementById("tempSystem");
	tempSystem.textContent = JSON.stringify(weatherObjectData.query.results.channel.units.temperature);
	tempSystem.textContent = tempSystem.textContent.substr(1, tempSystem.textContent.length - 2);
	
	var currentTempDes = document.getElementById("currentTempDes");
	currentTempDes.textContent = JSON.stringify(weatherObjectData.query.results.channel.item.condition.text);
	currentTempDes.textContent = currentTempDes.textContent.substr(1, currentTempDes.textContent.length - 2);

	var humidity = document.getElementById("humidity");
    humidity.textContent = JSON.stringify(weatherObjectData.query.results.channel.atmosphere.humidity);
    humidity.textContent = humidity.textContent.substr(1, humidity.textContent.length - 2);

    var windSpeed = document.getElementById("windSpeed");
    windSpeed.textContent = JSON.stringify(weatherObjectData.query.results.channel.wind.speed);
    windSpeed.textContent = windSpeed.textContent.substr(1, windSpeed.textContent.length - 2);

    var speedSystem = document.getElementById("speedSystem");
    speedSystem.textContent = JSON.stringify(weatherObjectData.query.results.channel.units.speed);
    speedSystem.textContent = speedSystem.textContent.substr(1, speedSystem.textContent.length - 2);

	var currentTempCode;
	currentTempCode = weatherObjectData.query.results.channel.item.condition.code;
	getPicturePath(currentTempCode, "currentTempPic");

	var days = [];
	var texts = [];
	var highs = [];
	var lows = [];
	var dayTempCode = [];

    //will get the weather info for all 10 days
    for (var counter = 0; counter < NUM_OF_DAYS; counter++) {
        days.push(document.getElementById("day"+counter));
        days[counter].textContent = JSON.stringify(weatherObjectData.query.results.channel.item.forecast[counter].day);
        days[counter].textContent = days[counter].textContent.substr(1, days[counter].textContent.length - 2);

        texts.push(document.getElementById("text"+counter));
        texts[counter].textContent = JSON.stringify(weatherObjectData.query.results.channel.item.forecast[counter].text);
        texts[counter].textContent = texts[counter].textContent.substr(1, texts[counter].textContent.length - 2);

        highs.push(document.getElementById("high"+counter));
        highs[counter].textContent = JSON.stringify(weatherObjectData.query.results.channel.item.forecast[counter].high);
        highs[counter].textContent = highs[counter].textContent.substr(1, highs[counter].textContent.length - 2);

        lows.push(document.getElementById("low"+counter));
        lows[counter].textContent = JSON.stringify(weatherObjectData.query.results.channel.item.forecast[counter].low);
        lows[counter].textContent =  lows[counter].textContent.substr(1,  lows[counter].textContent.length - 2);

        dayTempCode.push(weatherObjectData.query.results.channel.item.forecast[counter].code);
        getPicturePath(dayTempCode[counter], "main"+counter);
    }
	
}


