const xlsx = require('xlsx');

$('document').ready(() => {
  $('input.playlist-input').on('change', (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const workbook = xlsx.read(fileReader.result, { cellStyles: true });
      /*
      const workSheetName = workbook.SheetNames[0];
      console.log(workbook.Sheets[workSheetName]);
      */
      console.log(workbook);
    };
  });
});
