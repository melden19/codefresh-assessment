import React, { useContext, useCallback } from 'react';
import MonacoEditor from 'react-monaco-editor';
import BaseLayout from '../BaseLayout';
import { Store } from '../../App.store';
import './style.scss';

const Pipeline = () => {
    const store = useContext(Store);
    const { editor, response, error, loading, storageLayer } = store.pipeline;

    const handlerStorageChange = useCallback(e => {
        storageLayer.set(e.target.value);
    }, [storageLayer]);

    const runPipeline = useCallback(() => {
        loading.set(true);

        const base64Pipeline = window.btoa(editor.value);

        fetch('http://localhost:8080/api/pipelines/run', {
            body: JSON.stringify({
                pipeline: base64Pipeline,
                storageLayer: storageLayer.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST'
        })
            .then(res => res.json())
            .then(response.set)
            .catch(error.set)
            .finally(() => {
                loading.set(false);
            })
    }, [editor, storageLayer]);

    return (
        <BaseLayout title="Pipeline" className="pipeline-page">
            <div className="wrapper">
                <div style={{ width: '50%' }}>
                    <MonacoEditor
                        width="100%"
                        height="700"
                        language="yaml"
                        theme="vs-light"
                        value={editor.value}
                        onChange={editor.set}
                    />
                    <div className="controlls">
                        <select value={storageLayer.value} onChange={handlerStorageChange}>
                            <option value="fs">File system</option>
                            <option value="mongo">Mongo</option>
                        </select>

                        <button onClick={runPipeline}>Run pipeline</button>
                    </div>
                </div>
                <div>
                    <h2>Result:</h2>
                    <hr />
                    <div className="result response">
                        {loading.value
                            ? 'Running...'
                            : error.value
                                ? <div className="error">
                                    {error.value.toString()}
                                </div>
                                : <div>
                                    {typeof response.value === 'string' ? response.value : JSON.stringify(response.value, null, 2)}
                                </div>
                        }
                    </div>
                </div>
            </div>
        </BaseLayout>
    )
}

export default Pipeline;
