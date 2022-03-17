const verifyStudentNo = (studentNo) => {
  // 学生証のバーコードは学生番号7桁+0
  return /^\d{7}0$/.test(studentNo);
};

// 2022/01/01 01:01:01
const detailDateFormatter = new Intl.DateTimeFormat(
  'ja-JP',
  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
);

// 2022/01/01
const simpleDateFormatter = new Intl.DateTimeFormat(
  'ja-JP',
  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
);
