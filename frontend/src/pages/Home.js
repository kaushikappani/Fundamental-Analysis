import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import 'bootstrap/dist/css/bootstrap.min.css';


import axios from 'axios';
import SearchBox from '../components/SearchBox';


const Home = () => {
    const [symbols, setSymbols] = useState([]);
    const [data, setData] = useState([]);
    const [coorporateInfo, setCoorporateInfo] = useState([]);
    const [newSymbol, setNewSymbol] = useState('');
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
            <SearchBox newSymbol = {newSymbol} symbols = {symbols} setNewSymbol = {setNewSymbol} />

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