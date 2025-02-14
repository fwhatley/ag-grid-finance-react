import { useEffect, useRef, useState } from "react";
import { ColDef, AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const ROWS = 50;
const COLS = 30;
const UPDATE_INTERVAL = 200; // 5 updates per second
const PRICE_INCREMENT = 0.01;

const generateData = (basePrice = 1.01) => {
    return Array.from({ length: ROWS }, (_, rowIndex) => {
        const rowData: any = { symbol: `SYM${rowIndex + 1}` };
        for (let i = 0; i < COLS; i++) {
            rowData[`col${i}`] = (basePrice + Math.random() * 0.02 - 0.01).toFixed(2);
        }
        return rowData;
    });
};

const Grid = () => {
    const gridApiRef = useRef<any>(null);
    const [rowData] = useState(generateData(1.01));
    const priceRef = useRef(1.01);

    useEffect(() => {
        const updatePrices = () => {
            priceRef.current += PRICE_INCREMENT;
            const updates = generateData(priceRef.current);
            gridApiRef.current?.applyTransactionAsync({ update: updates });
        };

        const intervalId = setInterval(updatePrices, UPDATE_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    const colDefs: ColDef[] = [
        { field: "symbol", headerName: "Symbol", pinned: "left" },
        ...Array.from({ length: COLS }, (_, i) => ({
            field: `col${i}`,
            headerName: `Price ${i + 1}`,
            width: 100,
        })),
    ];

    return (
        <AgGridReact
            ref={gridApiRef}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
            // animateRows={true}
            // suppressRowTransform={true}
            getRowId={(params) => params.data.symbol}
            onGridReady={(params) => (gridApiRef.current = params.api)}
            rowBuffer={0}
        />
    );
};

const QuoteExample = () => {
    const [showManyGrids, setShowManyGrids] = useState(false);

    return (
        <div style={{ width: "1400px", height: "1000px" }}>
            <h1>Real-Time Quote Grid</h1>
            <div>
                <div>Row x Col: {ROWS} x {COLS}</div>
                <div>Total cell updates: {ROWS * COLS}</div>
                <div>Update interval (ms): {UPDATE_INTERVAL}</div>
                <button onClick={() => setShowManyGrids(!showManyGrids)}>
                    {showManyGrids ? "Show 1 Grid" : "Show 12 Grids"}
                </button>
            </div>

            {showManyGrids ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} style={{ width: "100%", height: "300px", border: "1px solid #ccc" }}>
                            <Grid />
                        </div>
                    ))}
                </div>
            ) : (
                <Grid />
            )}
        </div>
    );
};

export default QuoteExample;
