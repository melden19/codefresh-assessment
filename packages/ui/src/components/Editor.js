import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

export default function Editor() {
    const [editorState, setES] = useState();

    const options = {
        selectOnLineNumbers: true
      };


    return (
        <MonacoEditor
            width="800"
            height="600"
            language="javascript"
            theme="vs-dark"
            value={editorState}
            options={options}
            onChange={setES}
        />
    );
}
