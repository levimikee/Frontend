import React, { useState, useEffect } from "react";
import { Button, Layout, PageHeader } from "antd";
import { API_BASE_URL } from "@/config/serverApiConfig";
import FileUpload from "../components/Fileupload"
import { Spin, Progress } from "antd";
import DocumentsTable from "@/components/DocumentsTable";

const { Content } = Layout;

const styles = {
    content: {
        padding: "0px 16px 16px 16px",
        margin: "50px auto",
        width: "100%",
        minHeight: "600px",
        maxWidth: "1200px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
    }
};


const Uploadfile = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [documentId, setDocumentId] = useState(null)
    const [documents, setDocuments] = useState([])
    const [processingInfo, setProcessingInfo] = useState({})
    const [processedPErcentage, setProcessedPercentage] = useState(0)

    useEffect(() => {
        let intervalId;
        if (documentId) {
            intervalId = setInterval(async () => {
                const response = await fetch(`${API_BASE_URL}documentstatus/${documentId}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    const result = await response.json()
                    if (result.status === "completed") {
                        setUploadedFile(result.fileContent)
                        setDocumentId(null)
                        setIsLoading(false)
                        clearInterval(intervalId)
                    } else {
                        const processingInfo = {
                            totalRows: result?.totalRows ? result?.totalRows : 0,
                            rowsProcessed: result?.rowsProcessed ? result?.rowsProcessed : 0
                        }
                        const processedPErcentage = ((result?.rowsProcessed / result?.totalRows) * 100).toFixed(2)
                        setProcessedPercentage(processedPErcentage)
                        setProcessingInfo(processingInfo)
                    }
                }
            }, 1000);
        }
        fetchDocuments()
        return () => clearInterval(intervalId)
    }, [documentId])


    const fetchDocuments = async () => {
        const response = await fetch(`${API_BASE_URL}documents/`, {
            method: 'GET',
        });

        if (response.ok) {
            const result = await response.json();
            const data = result.data
            data.forEach((item) => {
                item.processedPErcentage = ((item.rowsProcessed / item.totalRows) * 100).toFixed(2)
            })
            setDocuments(data);

            // Check if any document is still processing
            const isProcessing = result.data.some((doc) => doc.status === 'processing');

            // If any document is processing, call fetchDocuments again after 3 seconds
            if (isProcessing) {
                setTimeout(fetchDocuments, 1000);
            }
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);



    const handleFileUpload = async (file) => {
        setIsLoading(true);

        try {
            // Create FormData and append the file
            const formData = new FormData();
            formData.append('file', file);

            // Perform API call with FormData
            const response = await fetch(`${API_BASE_URL}uploadFile`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                // Handle the response from the server if needed
                setDocumentId(result?.result._id)
                setUploadedFile(result.fileContent)
            } else {
                console.error('Error uploading file:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleDownload = (uploadedFile) => {
        if (uploadedFile) {
            const blob = new Blob([uploadedFile], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "output-data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    return (
        <Layout className="site-layout">
            <Content className="site-layout-background" style={styles.content}>
                <PageHeader
                    title={"Upload CSV file"}
                    onBack={
                        () => {
                            setIsLoading(false);
                            setUploadedFile(null)
                        }
                    }
                    ghost={false}
                    style={{
                        alignSelf: "flex-start",
                        padding: "20px 0px",
                    }}
                ></PageHeader>
                {
                    isLoading &&
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Spin size="large" />
                        {
                            processingInfo.totalRows > 0 &&
                            <>
                                <div style={{ marginTop: '46px', marginBottom: '50px' }}>{`Processing ${processingInfo.rowsProcessed}/${processingInfo.totalRows} rows. Please wait...`}</div>
                                <Progress type="circle" percent={processedPErcentage} style={{ marginTop: '16px', marginBottom: '50px', marginLeft: '55px' }} />
                            </>
                        }
                    </div>
                }
                {
                    uploadedFile && !isLoading ?
                        <Button type="primary" onClick={() => handleDownload(uploadedFile)}>Download File</Button>
                        :
                        <>
                            {!isLoading && <FileUpload onFileUpload={handleFileUpload} />}
                        </>

                }

                {
                    documents.length > 0 &&
                    <div style={{display: 'flex', marginTop: '30px'}}>
                        <DocumentsTable documents={documents}></DocumentsTable>
                    </div>
                }



            </Content>
        </Layout>
    );
};

export default Uploadfile;
