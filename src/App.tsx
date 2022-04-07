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
    const [exchangeRateName, setExchangeRateName] = useStateWithLabel(
        'exchangeRateName',
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

            setExchangeRateName(data.currency);
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
            return <option value={code.code}>{code.currency}</option>;
        });
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="p-10 block text-xl font-medium text-gray-700 text-center">
                Aplikacja służy do sprawdzania kursów walut z danego dnia według
                tabeli A NBP
            </h1>
            <div className="shadow w-6/12 sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-slate-200 space-y-6 sm:p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Data kursu:
                            <input
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Waluta:
                            <select
                                name="code"
                                value={currentCurrencyCode}
                                onChange={(e) =>
                                    setCurrentCurrencyCode(e.target.value)
                                }
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {options()}
                            </select>
                        </label>
                        <button
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleButton}
                        >
                            Pobierz kurs
                        </button>
                    </div>
                    {exchangeRate ? (
                        <h2 className="block text-xl font-medium text-gray-700 text-center">
                            Kurs <i>{exchangeRateName}</i>: {exchangeRate} PLN
                        </h2>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default App;
