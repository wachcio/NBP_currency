import React, { ReactEventHandler } from 'react';
import { useStateWithLabel } from './helpers/helpers';
import './App.css';

interface APIRes {
    table: string;
    currency: string;
    code: string;
    rates: [
        {
            no: string;
            effectiveDate: string;
            mid: number;
        }
    ];
}

function App() {
    const [currencyCode, setCurrencyCode] = useStateWithLabel(
        'currencyCode',
        'NOK'
    );

    const [date, setDate] = useStateWithLabel(
        'date',
        new Date().toISOString().slice(0, 10)
    );

    const [exchangeRate, setExchangeRate] = useStateWithLabel(
        'exchangeRate',
        null
    );

    const getDataFromAPI = async () => {
        const res = await fetch(
            `https://api.nbp.pl/api/exchangerates/rates/A/NOK/${date}?format=json`
        );
        const data: APIRes | string = await res.json();

        if (typeof data === 'string') return setExchangeRate(null);
        return setExchangeRate(data.rates[0].mid);
    };

    const handleButton = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        getDataFromAPI();
    };

    return (
        <div className="App">
            <h1>
                Aplikacja służy do sprawdzania kursów walut z danego dnia według
                tabeli A NBP
            </h1>
            <div className="form">
                <label>
                    Data kursu:
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label>Waluta 'NOK'</label>
                <button onClick={handleButton}>Pobierz kurs</button>
            </div>
            {exchangeRate ? <h2>Kurs: {exchangeRate}</h2> : null}
        </div>
    );
}

export default App;
