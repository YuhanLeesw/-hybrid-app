const fs = require('fs');
const readline = require('readline');
const filePath = 'userData.json';

// readline 인터페이스 설정
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 사용자로부터 아이디와 비밀번호 입력받기
rl.question('아이디를 입력하세요: ', (id) => {
  rl.question('비밀번호를 입력하세요: ', (password) => {
    // 새 사용자 객체 생성
    var newUser = {
      id: id,
      password: password,
      personal_best: 0,
      playcount: 0
    };

    // 회원가입 함수 호출
    registerUser(newUser, id);

    // readline 인터페이스 닫기
    rl.close();
  });
});

function registerUser(newUser, id) {
  // 기존 사용자 데이터 읽기
  var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 새 사용자 추가
  data.personal_data.push(newUser);
  data.number_of_people++;

  // 변경된 데이터를 JSON 형식으로 변환
  const jsonData = JSON.stringify(data, null, 2);

  // 파일에 데이터 저장
  try {
    fs.writeFileSync(filePath, jsonData);
    console.log(`사용자 등록 완료 ${id}님 환영합니다.`);
  } catch (e) {
    console.error('파일 저장 중 오류 발생:', e);
  }
}
