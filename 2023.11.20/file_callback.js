const fs = require('node:fs');
var content = "송우근은 김재혁이랑 베스트프렌드다";
const filePath = "love.txt";

function writeHandle(e){
    if(e){
        console.log("에러!!!!");
    }else{
        console.log("이 PC에 그들의 사랑이 영원히 기록됩니다.");
    }
}

function readHandle(e, data)
{
    if(e){
        console.log("에러!!!!");
    }else{
        console.log("읽어온 data:" + data);
    }
}

fs.writeFile(filePath, content, writeHandle);
fs.readFile(filePath, 'utf8', readHandle);