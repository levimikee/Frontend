import React, { useState, useEffect } from "react";
import { Table, Spin, Button, Progress } from "antd";
import { API_BASE_URL } from "@/config/serverApiConfig";

const DocumentsTable = ({ documents }) => {

    const formatDate = (inputDate) => {
        const dateTime = new Date(inputDate);
        // Get date and time components
        const date = dateTime.toLocaleDateString(); // Format: MM/DD/YYYY
        const time = dateTime.toLocaleTimeString(); // Format: HH:MM:SS
        return { date, time }
    }

    const formatMsToHMS = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));

        const timeComponents = [];

        if (hours > 0) {
            timeComponents.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        }

        if (minutes > 0) {
            timeComponents.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        }

        if (seconds > 0 || (hours === 0 && minutes === 0)) {
            timeComponents.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
        }

        return timeComponents.join(' ');
    }


    const handleDownload = (rowData) => {
        if (rowData) {
            const blob = new Blob([rowData.fileContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "output-data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleCancel = async (rowData) => {
        try {
            const response = await fetch(`${API_BASE_URL}cancelprocessing/${rowData._id}`, {
                method: 'GET'
            });

            if (response.ok) {
                const result = await response.json();
            } else {
                console.error('Error cancelling processing:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const columns = [
        {
            title: "Index",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Uploaded Date",
            dataIndex: "uploadeddate",
            key: "uploadeddate",
            render: (uploadeddate) => {
                const { date, time } = formatDate(uploadeddate)
                return <span>{`${date} ${time}`}</span>
            }
        },
        {
            title: "Completed Date",
            dataIndex: "completeddate",
            key: "completeddate",
            render: (completeddate, record) => {
                const { date, time } = formatDate(completeddate)
                return <span>{record.status === 'processing' ? "" : `${date} ${time}`}</span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                return <span>{status}</span>;
            },
        },
        {
            title: "Processing time",
            dataIndex: "processingTime",
            key: "processingTime",
            render: (processingTime) => {
                return <span>{formatMsToHMS(processingTime)}</span>;
            },
        },
        {
            title: "Proxy request count",
            dataIndex: "requestCount",
            key: "requestCount",
        },
        {
            title: "Total rows",
            dataIndex: "totalRows",
            key: "totalRows",
        },
        {
            title: "Download",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <>
                    {

                        status === 'completed' ?
                            <Button type="primary" onClick={() => { handleDownload(record)}}>Download File</Button>
                            :
                        status === 'cancelled' ?
                            <span>Cancelled</span>
                            :
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                {
                                    record.rowsProcessed ?
                                        <>
                                            <Progress percent={record.processedPErcentage ? record.processedPErcentage : 0} size="small" />
                                            Processing {record.rowsProcessed}/{record.totalRows}
                                            <Button type="primary" style={{ marginTop: '10px' }} onClick={() => { handleCancel(record)}}>Cancel</Button>
                                        </>
                                        :
                                        <Spin size="small" />

                                }
                            </div>

                    }
                </>
            ),
        }
    ];

    if (!documents?.length) {
        return <span>No previous data to show!</span>;
    }


    //Map events array to create table data
    const tableData = documents.map((document, index) => {
        return {
            _id: document._id,
            index: index.toString(),
            uploadeddate: document.createdAt,
            completeddate: document.completedAt,
            status: document.status,
            fileContent: document.fileContent,
            processedPErcentage: document.processedPErcentage,
            rowsProcessed: document.rowsProcessed,
            totalRows: document.totalRows,
            processingTime: document.processingTime,
            requestCount: document.requestCount
        };
    });


    return <Table rowKey={(document) => document.index} dataSource={tableData} columns={columns} />;
};

export default DocumentsTable;
