const verifyId = (id) => {
  // バーコード
  // 学生証: 学生番号7桁 (1|2|3|4 年度(20\d{2}) 連番(\d{2})) + 0
  // 教職員: 7桁         0 0[1-5 9]0 \d{3}                   + 0
  //                         1:M, 2:E, 3:C, 4:A, 5:一般分野(人文社会 + 自然科学), 9:事務
  const isStudent = /^[1-4]20\d{2}\d{2}0$/.test(id);
  const isTeacherOrStaff = /^00[1-59]0\d{3}0$/.test(id);
  const verify = isStudent || isTeacherOrStaff;
  return verify;
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

const simpleTimeFormatter = new Intl.DateTimeFormat(
  'ja-JP',
  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: "narrow",
    hour: '2-digit',
    minute: '2-digit',
  }
);
