//script.js (Only the javascript code)

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const apiKey = '5c4170cf05b21adebb52da61301c97fd';

        async function getWeather() {
            const city = document.getElementById('city').value;
            if (!city) {
                alert('Please enter a city name');
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.cod !== '200') {
                    alert(data.message);
                    return;
                }

                document.getElementById('forecast-heading').style.display = 'none';
                document.getElementById('search-box').style.display = 'none';
                document.getElementById('temperature-chart').style.display = 'block';
                document.getElementById('humidity-chart').style.display = 'block';
                displayWeather(data);
                renderTemperatureChart(data);
                renderHumidityChart(data);
            } catch (error) {
                alert('Failed to fetch weather data');
            }
        }

        function displayWeather(data) {
            const weatherInfoDiv = document.getElementById('weather-info');
            const mainWeatherDiv = document.getElementById('main-weather');
            weatherInfoDiv.innerHTML = '';
            mainWeatherDiv.innerHTML = '';

            const city = data.city.name;
            const country = data.city.country;
            const currentWeather = data.list[0];
            const mainTemp = Math.round(currentWeather.main.temp);
            const mainWeather = currentWeather.weather[0].main;
            const mainWeatherDescription = currentWeather.weather[0].description;
            const mainWeatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
            const mainWindSpeed = currentWeather.wind.speed;
            const mainHumidity = currentWeather.main.humidity;
            const searchDateTime = new Date();
            const formattedDate = searchDateTime.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
            const formattedTime = searchDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            mainWeatherDiv.innerHTML = `
                <h2><strong>${city}, ${country}</strong></h2>
                <p><strong>${formattedDate} | ${formattedTime}</strong></p>
                <p><strong><img src="${mainWeatherIcon}" alt="${mainWeather}"> <span>${mainTemp}°C</span></strong></p>
                <p><strong>${mainWeatherDescription.charAt(0).toUpperCase() + mainWeatherDescription.slice(1)}</strong></p>
                <p><strong>Wind : ${mainWindSpeed} m/s</strong></p>
                <p><strong>Humidity : ${mainHumidity}%</strong></p>
            `;

            const today = new Date();
            const fiveDays = Array.from({ length: 5 }, (_, i) => {
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i + 1);
                return futureDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
            });

            fiveDays.forEach((date, index) => {
                const weatherData = data.list[index + 8];
                const temp = Math.round(weatherData.main.temp);
                const weather = weatherData.weather[0].main;
                const weatherDescription = weatherData.weather[0].description;
                const weatherIcon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
                const windSpeed = weatherData.wind.speed;
                const humidity = weatherData.main.humidity;

                weatherInfoDiv.innerHTML += `
                    <div class="day">
                        <div class="summary">
                            <p><strong>${date}</strong></p>
                            <p><strong><img src="${weatherIcon}" alt="${weather}"></strong></p>
                            <p><strong>${temp}°C</strong></p>
                        </div>
                        <div class="details">
                            <p><strong>Humidity : ${humidity}%</strong></p>
                            <p><strong><img src="${weatherIcon}" alt="${weather}"></strong></p>
                            <p><strong>Wind : ${windSpeed} m/s</strong></p>                                           
                        </div>
                    </div>
                `;
            });
        }

        function renderTemperatureChart(data) {
            const tempCtx = document.getElementById('temp-chart').getContext('2d');
            const hours = [];
            const temperatures = [];

            for (let i = 0; i < 8; i++) {
                const weather = data.list[i];
                const hour = new Date(weather.dt_txt).getHours();
                hours.push(`${hour}:00`);
                temperatures.push(Math.round(weather.main.temp));
            }

            new Chart(tempCtx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        fill: true,
                        borderWidth: 2.5,
                        pointBackgroundColor: 'rgba(255, 0, 0, 0.3)',
                        pointBorderColor: 'rgba(255, 0, 0, 0.5)',
                        pointRadius: 3
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time (24-hour format)',
                                color: '#444'
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                                color: '#444'
                            },
                        }
                    },
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff'
                        }
                    }
                }
            });
        }

        function renderHumidityChart(data) {
            const humCtx = document.getElementById('hum-chart').getContext('2d');
            const hours = [];
            const humidities = [];

            for (let i = 0; i < 8; i++) {
                const weather = data.list[i];
                const hour = new Date(weather.dt_txt).getHours();
                hours.push(`${hour}:00`);
                humidities.push(weather.main.humidity);
            }

            new Chart(humCtx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Humidity (%)',
                        data: humidities,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        fill: true,
                        borderWidth: 2.5,
                        pointBackgroundColor: 'rgba(0, 0, 255, 0.3)',
                        pointBorderColor: 'rgba(0, 0, 255, 0.5)',
                        pointRadius: 3
                    }]
                },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (24-hour format)',
                            color: '#444'
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Humidity (%)',
                            color: '#444'
                        },
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                }
            }
        });
        }
</script>
