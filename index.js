function displayExcel() {
  console.log("Upload Clicked!")
  const excel_file = document.getElementById('excel_file');
  excel_file.addEventListener('change', (event) => {
      if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type))
      {
          document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
          excel_file.value = '';
          return false;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.onload = function(event){
          var data = new Uint8Array(reader.result);
          var work_book = XLSX.read(data, {type:'array'});
          var sheet_name = work_book.SheetNames;
          var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});
          if(sheet_data.length > 0)
          {
              var table_output = '<table class="table table-striped table-bordered">';
              for(var row = 0; row < sheet_data.length; row++)
              {
                  table_output += '<tr>';
                  for(var cell = 0; cell < sheet_data[row].length; cell++)
                  {
                      if(row == 0)
                      {
                          table_output += '<th>'+sheet_data[row][cell]+'</th>';
                      }
                      else
                      {
                          table_output += '<td>'+sheet_data[row][cell]+'</td>';
                      }
                  }
                  table_output += '</tr>';
              }
              table_output += '</table>';
              document.getElementById('excel_data').innerHTML = table_output;
          }
          excel_file.value = '';
      }
  });
}

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], {type: "text/csv"});

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}

function downloadExcel(tableID){
  console.log("Download Clicked!")
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = 'predicted_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}