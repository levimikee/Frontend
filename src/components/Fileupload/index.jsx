import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onFileUpload }) {
    const onDrop = useCallback((acceptedFiles) => {
        // Check if only one file is selected
        if (acceptedFiles.length === 1) {
            const file = acceptedFiles[0];
            // Check if the file is a CSV
            if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
                onFileUpload(file);
            } else {
                alert('Please upload a CSV file.');
            }
        } else {
            alert('Please upload only one file.');
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={dropzoneStyles}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop a CSV file here, or click to select one</p>
        </div>
    );
};

const dropzoneStyles = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    width: '100%',
    height: '300px',
    textAlign: 'center',
    cursor: 'pointer',
};
