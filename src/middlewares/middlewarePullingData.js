import axios from 'axios';

import { FIND_WEATHER } from '../actions/FindWeatherActions';

const middlewarePullingData = () => (next) => async (action) => {
    const { type } = action;

    const configurePayaload = (res) => {
        switch (type) {
        case FIND_WEATHER: {
            const {
                main, weather, wind, name,
            } = res.data;
            const {
                // eslint-disable-next-line camelcase
                temp, pressure, humidity, temp_max, temp_min,
            } = main;
            const { speed } = wind;
            const { icon } = weather[0];

            action.payload = {
                city: name,
                tempMax: temp_max,
                tempMin: temp_min,
                icon,
                temp,
                pressure,
                humidity,
                speed,
                errorMessage: '',
            };
        } break;
        default:
        }
    };

    switch (type) {
    case FIND_WEATHER: {
        const { city } = action.payload;
        try {
            await axios
                .post(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=971d414e89f3c0b3df147fbb3ad30cb7`)
                .then((response) => configurePayaload(response));
        } catch (error) {
            action.payload = {
                error: 'Check your city name',
            };
        }
    } break;
    default:
    }
    next(action);
};
export default middlewarePullingData;
