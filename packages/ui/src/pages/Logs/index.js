import React, { useState, useCallback } from 'react'
import './style.scss'

const Logs = () => {
    const [container, setContainer] = useState('');
    const [storageLayer, setStorageLayer] = useState('fs');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');

    const handlerChange = useCallback(e => {
        setContainer(e.target.value);
    }, []);
    const handlerStorageChange = useCallback(e => {
        setStorageLayer(e.target.value);
    }, []);

    const handleGetLogs = useCallback(() => {
        setLoading(true);
        setError(null);
        setResponse('');
        fetch(`http://localhost:8080/api/${container}/logs?storageLayer=${storageLayer}`)
            .then(res => res.json())
            .then(setResponse)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [container, storageLayer]);

    return (
        <div>
            <h1>Logs</h1>
            <hr/>
            <section>
                <select value={storageLayer} onChange={handlerStorageChange}>
                    <option value="fs">File system</option>
                    <option value="mongo">Mongo</option>
                </select>
                <input type="text" value={container} onChange={handlerChange}/>
                <button onClick={handleGetLogs}>{loading ? 'Loading...' : 'Get logs'}</button>
                <p>Response</p>
                <div className="response">
                    {error ? <div className="error">
                        {error.toString()}
                    </div> : <div>
                        {typeof response === 'string' ? response : JSON.stringify(response)}
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default Logs;
