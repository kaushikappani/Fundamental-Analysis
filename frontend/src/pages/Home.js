import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Autosuggest from 'react-autosuggest';

import 'bootstrap/dist/css/bootstrap.min.css';


import axios from 'axios';


const Home = () => {
    const [symbols, setSymbols] = useState([]);
    const [data, setData] = useState([]);
    const [coorporateInfo, setCoorporateInfo] = useState([]);
    const [newSymbol, setNewSymbol] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const addSymbol = () => {
        setData(prevVal => {
            return [...prevVal, newSymbol];
        });
        setNewSymbol('');
    };

    const getAllStockSymbols = async() => {
        const { data } = await axios.get("http://localhost:3030/api")
        setSymbols(data);
    }

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : symbols.filter(symbol => symbol.toLowerCase().includes(inputValue));
    };


    const onSuggestionSelected = (event, { suggestion }) => {
        setNewSymbol(suggestion);
    };

    const renderSuggestion = suggestion => <div>{suggestion}</div>;

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = suggestion => suggestion;

    const getEquityCorporateInfo = async () => {
        setLoading(true);

        for (const e of data) {
            const info = await axios.get('http://localhost:3030/api/' + e);
            setCoorporateInfo(prevVal => {
                const newEntry = {
                    copInfo: info.data.corporate.shareholdingPatterns,
                    Symbol: e
                };
                if (prevVal.some(entry => entry.Symbol === e)) {
                    return prevVal;
                } else {
                    return [...prevVal, newEntry];
                }
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllStockSymbols();
    }, [])
    useEffect(() => {
        getEquityCorporateInfo();
    }, [data]);

   

    return (
        <Container>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    placeholder: 'Type a symbol',
                    value: newSymbol,
                    onChange: (event, { newValue }) => {
                        setNewSymbol(newValue);
                    }
                }}
                onSuggestionSelected={onSuggestionSelected}
            />

            <button onClick={addSymbol}>Add</button>
            {coorporateInfo &&
                coorporateInfo.map((e, index) => {
                    console.log(e);
                    return (
                        <Table striped="columns" key={index}>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>{e.copInfo.data[0].name}</th>
                                    <th>{e.copInfo.data[1].name}</th>
                                    <th>{e.copInfo.data[2].name}</th>
                                    <th>{e.copInfo.data[3].name}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{e.Symbol}</td>
                                    <td>{e.copInfo.data[0]['31-Mar-2023']}</td>
                                    <td>{e.copInfo.data[1]['31-Mar-2023']}</td>
                                    <td>{e.copInfo.data[2]['31-Mar-2023']}</td>
                                    <td>{e.copInfo.data[3]['31-Mar-2023']}</td>
                                </tr>
                            </tbody>
                        </Table>
                    );
                })}
            {loading && <h1>loading</h1>}
        </Container>
    );
};

export default Home;