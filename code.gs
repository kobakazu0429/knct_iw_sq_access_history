const doPost = (e) => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const json = JSON.parse(e.postData.contents);

  if (json.type === "enter") {
    const enterSheet = ss.getSheetByName("入室");
    enterSheet.appendRow([json.time, json.studentNo, json.numberOfPeople]);
  } else if (json.type === "leave") {
    const leaveSheet = ss.getSheetByName("退室");
    leaveSheet.appendRow([json.time, json.studentNo, json.equipments]);
  }

  const result = JSON.stringify({ status: " done" });
  return ContentService.createTextOutput(result);
};
