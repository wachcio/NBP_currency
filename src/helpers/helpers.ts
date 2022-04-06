import { useState, useDebugValue } from 'react';

export const useStateWithLabel = (name: string, initialValue: any) => {
    const [value, setValue] = useState(initialValue);
    useDebugValue(`${name}: ${value}`);
    return [value, setValue];
};

//const [data, setData] = useStateWithLabel('data', []);
