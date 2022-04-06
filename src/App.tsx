import React, { ReactEventHandler } from 'react';
import { useStateWithLabel } from './helpers/helpers';
import { currencyCode } from './currencyCode';
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
    const [currentCurrencyCode, setCurrentCurrencyCode] = useStateWithLabel(
        'currentCurrencyCode',
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
        try {
            const res = await fetch(
                `https://api.nbp.pl/api/exchangerates/rates/A/${currentCurrencyCode}/${date}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            const data: APIRes = await res.json();

            return setExchangeRate(data.rates[0].mid);
        } catch {
            setExchangeRate('Niestety nie mogłem pobrać danych');
            new Error('Niestety nie mogłem pobrać danych');
        }
    };

    const handleButton = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        getDataFromAPI();
    };

    const options = () => {
        return currencyCode.map((code) => {
            return <option value={code}>{code}</option>;
        });
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
                <label>
                    Waluta:
                    <select
                        name="code"
                        value={currentCurrencyCode}
                        onChange={(e) => setCurrentCurrencyCode(e.target.value)}
                    >
                        {options()}
                    </select>
                </label>
                <button onClick={handleButton}>Pobierz kurs</button>
            </div>
            {exchangeRate ? <h2>Kurs: {exchangeRate}</h2> : null}
        </div>
    );
}

export default App;
