import request from 'request';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3333;

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//globals
const apiKey = "2bc62ae8fc6dac84c9955d47b5fb3a15";
let msg = "";

//routes

app.get('/', (req, res) => {
        res.statusCode = 200;
        res.render('index');
});

app.get('/weather', (req, res) => {
        res.statusCode = 200;
        res.render('weather');
});

app.get('/final', (req, res) => {
    res.render('final');
});

app.post('/final', (req, res) => {
        let city = encodeURI(req.body.city);
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        console.log(url);
        getWeather();
        function getWeather() {
        request(url, async (err, response, body) => {
            try {
                let msg = "";
                let weatherPhrase = "";
                let headOfWeather = `<h2>Today's Forecast:</h2><br>`;
                msg = JSON.parse(response.body);
                let temperature = Math.floor( msg.main.temp );
                let forcast = await msg.weather[0].description;
                let forcastMsg = ` Expect ${forcast}.`;
                let tempString = `The temperature is ${temperature} degrees Fahrenheit`;
                if (temperature <= 75 && temperature > 55) {
                    weatherPhrase =`${headOfWeather}${tempString}, you may want to wear a jacket. <br>` + forcastMsg;
                    sendWeatherPhrase();
                } else if (temperature > 75) {
                    weatherPhrase =`${headOfWeather}${tempString}, I'd wear shorts if I were you. <br>` + forcastMsg;
                    sendWeatherPhrase();
                } else if (temperature <= 55) {
                    weatherPhrase =`${headOfWeather}${tempString}, bring a winter coat! <br>` + forcastMsg;
                    sendWeatherPhrase();
                };
                async function sendWeatherPhrase() {
                    res.send(weatherPhrase + `<br><a href="./weather"><br><button>Back To Choose City</button>`);
                };

            } catch (err) {
                console.error(err);
                return res.send(`<h2>Uhh Oh, Something Went Wrong!</h2><br>
                Problem fetching weather, enter a valid city and try again.
                <br><br>
                <a href="./weather"><button>Back To Choose City</button>
                `);
            };
        });
        };
    });



app.listen(port, () => {
    console.log(`application is running on port ${port}`);
  });
 
