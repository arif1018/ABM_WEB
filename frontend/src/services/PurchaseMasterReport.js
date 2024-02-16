// services/reportGenerator.js

import jsPDF from "jspdf";
// import "jspdf-autotable";
import autoTable from "jspdf-autotable";


// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns";

export function GeneratePWTL(trucklist){
  // initialize jsPDF
  const doc = new jsPDF()
  // define the columns we want and their titles
  const tableColumn = ["S.NO", "Party Name", "No of Trucks"]
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  trucklist.forEach((stock,i) => {
    const PartyWiseList = [
        i+1,
        stock.PartyName,
        stock.TotalTruck
    //   // called date-fns to format the date on the ticket
    //   format(new Date(ticket.updated_at), "yyyy-MM-dd")
    ];
    // push each tickcet's info into a row
    tableRows.push(PartyWiseList);
  });

  const totalQuantity = trucklist.reduce(
    (acc, item) => acc + item.TotalTruck,
    0
  );

  const PartyWiseList = [
    "",
    "TOTAL",
    totalQuantity,
];

tableRows.push(PartyWiseList);

// Stock List Heading
autoTable(doc,{ startY:25,
  body:[
    [
      {
        content:"Party Wise Truck List"
      }
    ],
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
    if(tableRows.row.index === trucklist.length){
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
  doc.save(`Party_Wise_Truck_List_${dateStr}.pdf`);
};

export function GenerateIWDL(itemList){
  // initialize jsPDF
  const doc = new jsPDF()
  // define the columns we want and their titles
  const tableColumn = ["S.NO", "Item Name", "No of Items"]
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  itemList.forEach((stock,i) => {
    const ItemWiseList = [
        i+1,
        stock.ItemName,
        stock.TotalItem
    //   // called date-fns to format the date on the ticket
    //   format(new Date(ticket.updated_at), "yyyy-MM-dd")
    ];
    // push each tickcet's info into a row
    tableRows.push(ItemWiseList);
  });

  const totalQuantity = itemList.reduce(
    (acc, item) => acc + item.TotalItem,
    0
  );

  const ItemWiseList = [
    "",
    "TOTAL",
    totalQuantity,
];

tableRows.push(ItemWiseList);

// Stock List Heading
autoTable(doc,{ startY:25,
  body:[
    [
      {
        content:"Item Wise Truck List"
      }
    ],
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
    if(tableRows.row.index === itemList.length){
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
  doc.save(`Item_Wise_Truck_List_${dateStr}.pdf`);
};

export function GeneratePIWDL(itemList){
  // initialize jsPDF
  const doc = new jsPDF()
  // define the columns we want and their titles
  const tableColumn = ["S.NO", "Party Name", "Item Name", "No of Items"]
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  itemList.forEach((stock,i) => {
    const ItemWiseList = [
        i+1,
        stock.PartyName,
        stock.ItemName,
        stock.TotalItem
    //   // called date-fns to format the date on the ticket
    //   format(new Date(ticket.updated_at), "yyyy-MM-dd")
    ];
    // push each tickcet's info into a row
    tableRows.push(ItemWiseList);
  });

  const totalQuantity = itemList.reduce(
    (acc, item) => acc + item.TotalItem,
    0
  );

  const ItemWiseList = [
    "",
    "",
    "TOTAL",
    totalQuantity,
];

tableRows.push(ItemWiseList);

// Stock List Heading
autoTable(doc,{ startY:25,
  body:[
    [
      {
        content:"Party & Item Wise Truck List"
      }
    ],
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
    if(tableRows.row.index === itemList.length){
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
  doc.save(`Party_Item_Wise_Truck_List_${dateStr}.pdf`);
};
