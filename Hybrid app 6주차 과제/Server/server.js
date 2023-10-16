const express = require('express'); // Express 프레임워크 모듈을 불러옴
const cors = require('cors'); // CORS 모듈을 불러옴

const app = express(); // Express 앱 객체 생성
const port = 8082; // 서버 포트 설정

app.use(cors()); //웹 서버에서 다른 도메인의 웹 페이지가 서버의 리소스에 접근할 수 있도록허용하는 설정 (미들웨어로 CORS 지원 설정)

app.get('/hi',hi); // 'hi' 경로로 GET 요청이 오면 hi 함수를 실행

function hi(req,res)
{   // 클라이언트에 메시지 응답
    res.send('안녕하세요. 202227073학번 이성우의 서버에 오신걸 환영합니다. <br>' 
    + 'res.send 를 두개만들어 보았습니다 근데 res.send는 한번만 호출될 수 있다고 하니 메세지를 결합해보는 것도 해보았습니다. <br>'
    +'줄바꿈도 해볼라고 하니, 자바스크립트에는 HTML 형식으로 데이터를 보내는 것과 클라이언트에서 해당 데이터를 처리하는 방식에 차이가 있다고하네요.');
}
app.listen(port,start_server); // 서버 시작시 로그 출력
function start_server()
{
    console.log(`서버를 생성하였습니다. ( http://localhost:${port} )`);
}