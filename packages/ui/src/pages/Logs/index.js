import React, { useCallback, useContext } from 'react'
import BaseLayout from '../BaseLayout'
import { Store } from '../../App.store';
import './style.scss'

const Logs = () => {
    const store = useContext(Store)
    const { container, error, loading, response, storageLayer } = store.logs;

    const handlerChange = useCallback(e => {
        container.set(e.target.value);
    }, [container]);
    const handlerStorageChange = useCallback(e => {
        storageLayer.set(e.target.value);
    }, [storageLayer]);

    const handleGetLogs = useCallback(() => {
        loading.set(true);
        error.set(null);
        response.set('');
        fetch(`http://localhost:8080/api/containers/${container.value}/logs?storageLayer=${storageLayer.value}`)
            .then(res => res.json())
            .then(response.set)
            .catch((err) => {
                console.error(err);
                error.set(err);
            })
            .finally(() => loading.set(false));
    }, [container, storageLayer]);

    return (
        <BaseLayout title="Logs" className="logs-page">
            <div className="controls">
                <div>
                    <label htmlFor="logs_select">Storage Layer</label>
                    <select id="logs_select" value={storageLayer.value} onChange={handlerStorageChange}>
                        <option value="fs">File system</option>
                        <option value="mongo">Mongo</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="logs_input">Container ID</label>
                    <input id="logs_input" type="text" value={container.value} onChange={handlerChange}/>
                </div>
                <button onClick={handleGetLogs}>{loading.value ? 'Loading...' : 'Get logs'}</button>
            </div>
            <p>Response</p>
            <div className="response">
                {error.value ? <div className="error">
                    {error.value.toString()}
                </div> : <div>
                    {typeof response.value === 'string' ? response.value : JSON.stringify(response.value, null, 2)}
                </div>}
            </div>
        </BaseLayout>
    )
}

export default Logs;
