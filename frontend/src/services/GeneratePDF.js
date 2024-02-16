// services/reportGenerator.js

import jsPDF from "jspdf";
// import "jspdf-autotable";
import autoTable from "jspdf-autotable";


// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns";

const GeneratePDF = (stockList, stockhead) => {
  // initialize jsPDF
  const doc = new jsPDF()
  // define the columns we want and their titles
  const tableColumn = ["S.NO", `${stockhead ? "Party Name" : "Item Name"}`, "Quantity", "LBS", "KG"]
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  stockList.forEach((stock,i) => {
    const stockData = [
        i+1,
        stock.ItemName,
        stock.Quantity,
        Math.round(stock.LBS).toLocaleString("en-US"),
        Math.round(stock.KG).toLocaleString("en-US"),
    //   // called date-fns to format the date on the ticket
    //   format(new Date(ticket.updated_at), "yyyy-MM-dd")
    ];
    // push each tickcet's info into a row
    tableRows.push(stockData);
  });

  const totalQuantity = stockList.reduce(
    (acc, item) => acc + item.Quantity,
    0
  );
  const totalLBS = stockList.reduce(
    (acc, item) => acc + item.LBS,
    0
  );
  const totalKG = stockList.reduce(
    (acc, item) => acc + item.KG,
    0
  );

  const stockData = [
    "",
    "TOTAL",
    totalQuantity,
    Math.round(totalLBS).toLocaleString("en-US"),
    Math.round(totalKG).toLocaleString("en-US"),
];

tableRows.push(stockData);

// Stock List Heading
autoTable(doc,{ startY:25,
  body:[
    [
      {
        content:"Stock List"
      }
    ],
    [
      {
        content:`${stockhead ? stockhead : "TOTAL STOCK"}`
      }
    ]
  ],
  theme:"grid",
  styles:{
    font:'Sans',
    halign:'center',
    fillColor:"#000",
    textColor:"#fff",
    fontSize:15
  }
})

autoTable(doc,{
  head:[tableColumn],
  body:tableRows,
  didParseCell:  (tableRows)=>{
    if(tableRows.row.index === stockList.length){
      tableRows.cell.styles.fillColor = "#000685"
      tableRows.cell.styles.textColor = "#fff"
      tableRows.cell.styles.fontStyle = "bold"
      // data.cell.styles.fillColor = [239, 154, 154]
    }
  },
  headStyles:{
    fillColor:"#000685"
  },
  theme:"grid"
})
  const date = Date().split(" ");
  const dateStr = date[0] +'_'+ date[1] +'_'+ date[2] +'_'+ date[3] +'_'+ date[4];
  doc.save(`Stock_List_${dateStr}.pdf`);
};

export default GeneratePDF;