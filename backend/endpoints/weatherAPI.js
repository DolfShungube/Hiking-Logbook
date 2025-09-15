const express = require("express");


const router = express.Router(); //

router.get("/forecast", async(req,res) =>{
    const lat = req.query.lat;
    const lon = req.query.lon;
    const API_KEY = process.env.VITE_WEATHER_API_KEY;

     // Validate query parameters
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }else{

        try{
            console.log('API running latitude and longitude are present')
            const response = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
            );

            const data = await response.json();
            res.json(data);

        }catch(err){
            res.status(500).json({error:"Error fetching weather data"})
        }
    }

});


module.exports = router;