import axios from 'axios';
import React from 'react'
import Container from 'react-bootstrap/esm/Container';
import Table from 'react-bootstrap/esm/Table';
import SearchBox from '../components/SearchBox';



const Details = () => {

    const [symbols, setSymbols] = React.useState([]);
    const [newSymbol, setNewSymbol] = React.useState('');
    const [data, setData] = React.useState(null);
    const [stockData, setStockData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [history, setHistory] = React.useState([]);
    const [totals, setTotals] = React.useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            const spaceSeparatedValues = fileContent.split(',');
            spaceSeparatedValues.forEach(item => {
                const stocksQuantity = item.split(" ");
                setHistory(prev => {
                    return [...prev, { symbol: stocksQuantity[0],quantity:stocksQuantity[1] }]
                })
            })
        };

        reader.readAsText(file);
    };

    const getAllStockSymbols = async () => {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3030/api")
        setSymbols(data);
        setLoading(false);
    }

    const getStockDetails = () => {
        setLoading(true);
        if (data != null) {
            axios.get("http://localhost:3030/api/details/" + data).then(data => {
                setStockData(preVal => {
                    return [...preVal, { payload: data.data ,quantity:1}]
                })
            })
        }
        setLoading(false);

    }

    const handleSubmit = () => {
        setData(newSymbol);
        setHistory(preVal => {
            return [...preVal, {symbol:newSymbol,quantity:1}];
        })
        setNewSymbol("");
    }
    const refrsh = () => {
        setLoading(true)
        setStockData([]);
        history.forEach(item => {
            axios.get("http://localhost:3030/api/details/" + item.symbol).then(data => {
                setStockData(preVal => {
                    return [...preVal, { payload: data.data ,quantity:item.quantity}]
                })
            }) 
        })
        setLoading(false);
        findTotals();
    }


    const findTotals = () => {
        console.log("totals started")
        let dayPL = 0;
        let dayPreOpenPL = 0;

        stockData.forEach(item => {
            dayPL += item.quantity * item.payload.priceInfo.change;
            dayPreOpenPL += (item.payload.preOpenMarket.IEP - item.payload.priceInfo.previousClose) * item.quantity;
        })
        dayPL = parseFloat(dayPL).toFixed(2);
        dayPreOpenPL = parseFloat(dayPreOpenPL).toFixed(2);
        setTotals({dayPL,dayPreOpenPL})
    }
    React.useEffect(() => {
        getAllStockSymbols();
    }, [])

    React.useEffect(() => {
        getStockDetails();
    }, [data])
    return (
        <Container >
            <SearchBox newSymbol={newSymbol} symbols={symbols} setNewSymbol={setNewSymbol} />
            
            
            <button onClick={handleSubmit}>
               Submit
            </button>
            <input type="file" onChange={handleFileChange} />
           
            
            {
                stockData && (
                    <>
                        <button onClick={refrsh}>Refresh</button>
                        <Table striped bordered hover responsive>

                            <tr>
                                <th>Symbol</th>
                                <th>CMP</th>
                                <th>Change</th>
                                <th>pChange</th>
                                <th>IntraDay-Band</th>
                                <th>Pre-Open price IEP</th>
                                <th>Quantity</th>
                                <th>DAY P/L</th>
                                <th>DAY Pre open P/L</th>


                            </tr>


                            {stockData.map((e, i) => {
                                return (
                                    e.payload.priceInfo && (<>
                                        <tr style={{ color: e.payload.priceInfo.change > 0 ? "green" : "red" }}>
                                            <td>{e.payload.metadata.symbol}</td>
                                            <td >{e.payload.priceInfo.lastPrice}</td>
                                            <td >{parseFloat(e.payload.priceInfo.change).toFixed(2)}</td>
                                            <td >{parseFloat(e.payload.priceInfo.pChange).toFixed(2)}</td>
                                            <td>{e.payload.priceInfo.intraDayHighLow.min} - {e.payload.priceInfo.intraDayHighLow.max}</td>
                                            <td>{e.payload.preOpenMarket.IEP}</td>
                                            <td>{e.quantity}</td>
                                            <th>{parseFloat(e.quantity * e.payload.priceInfo.change).toFixed(2)}</th>
                                            <th>{parseFloat((e.payload.preOpenMarket.IEP - e.payload.priceInfo.previousClose)* e.quantity).toFixed(2)}</th>
                                        </tr>
                                        {/* <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                                            <th>Preopen</th>
                                           
                                            {e.payload.preOpenMarket.preopen && (
                                                e.payload.preOpenMarket.preopen.map((item, i) => {  
                                                    return (<td>{item.price}</td>)
                                                })
                                            )}
                                        </div> */}
                                    </>)
                                )
                            })}
                            <tr>
                                <td>TOTAL</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{totals.dayPL}</td>
                                <td>{ totals.dayPreOpenPL}</td>
                            </tr>
                        </Table>

                    </>
                )
            }
            {loading && <h1>loading</h1>}
        </Container>
    )
}

export default Details