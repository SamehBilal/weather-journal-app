/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'b2c132dfd80a3ac53d3246bcdd15b827&units=metric'; // API Key for OpenWeatherMap

// Create a new date instance dynamically with JS
let d = new Date();
let newDate= d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', generateAction);

/* Function called by event listener */
function generateAction(e) {
    e.preventDefault();

    //get zip code & feeling
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    if (zipCode !== '') {
        getWeatherData(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add data to POST request
                postData('/add', { temp: data.main.temp, date: newDate, content: content });
            }).then(function() {
                updateUI() // call updateUI to update browser content
            }).catch(function(error) {
                console.log(error);
                alert(error);
            });
    } else {
        console.log('Some inputs needs to be filled first!');
        alert('Some inputs needs to be filled first!')
    }


}
/* Function to GET Web API Data*/
const getWeatherData = async(baseUrl, zipCode, apiKey) => {
    // res equals to the result of fetch function
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        // data equals to the result of fetch function
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};


/* Function to GET Project Data */
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update new entry values
        if (allData.temp !== undefined ) {
            document.getElementById('date').innerHTML = 'Date: '+allData.date;
            document.getElementById('temp').innerHTML = 'Temp: '+allData.temp ;
            document.getElementById('content').innerHTML = 'Feeling: '+allData.content;
        }
    } catch (error) {
        console.log('error', error);
    }
};