////JSON 파일 원본
//{
//    "name": "John",
//    "age": 30,
//    "city": "New York"
//}

const string_from_network = '{"name": "Sungwoo", "age": 43, "city": "Los Angeles", "citizenship": true}'

//문제 : console.log()를 이용하여 사용자의 name, age, city, citizenship을 각각 따로 출력하시오.

var json_body = [];
var key_value = [];
var key = [];
var value = [];

var isWriting = false;
var temp_string = '';
var temp_value;

function split(target_string, destination_array, tocken_string) {
    let temp_string1 = '';

    for (let i = 0; i < target_string.length; i++) {
        if (target_string[i] == tocken_string) {
            destination_array.push(temp_string1);
            temp_string1 = '';
            continue;
        }
        temp_string1 += target_string[i];
    }

    if (temp_string1 != '') {
        destination_array.push(temp_string1);
        temp_string1 = '';
    }
}

for (let i = 0; i < string_from_network.length; i++) {
    if (string_from_network[i] == '{') {
        isWriting = true;
        continue;
    } else if (string_from_network[i] == '}') {
        json_body.push(temp_string);
        temp_string = '';
        isWriting = false;
        continue;
    }
    if (isWriting)
        temp_string += string_from_network[i];
}


for (let i = 0; i < json_body.length; i++) {
    split(json_body[i], key_value, ',');
}

for (let i = 0; i < key_value.length; i++) {
    for (let j = 0; j < key_value[i].length; j++) {
        if (key_value[i][j] == ':') {
            key.push(temp_string);
            temp_string = '';
            continue;
        }
        temp_string += key_value[i][j];
    }
    if (key_value != '') {
        value.push(temp_string);
        temp_string = '';
    }
}

for (let i = 0; i < key.length; i++) {
    for (let j = 0; j < key[i].length; j++) {
        if (key[i][j] == '"' && isWriting == false) {
            isWriting = true;
            continue;
        }
        else if (key[i][j] == '"' && isWriting == true) {
            key[i] = '';
            key[i] += temp_string;
            temp_string = '';
            isWriting = false;
            break;
        }
        if (isWriting)
            temp_string += key[i][j];
    }
}

for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < value[i].length; j++) {
        if (value[i][j] == '"') {
            isWriting = true;
            continue;
        }
        else if (value[i][j] == '"' && isWriting == true) {
            value[i] == '';
            value[i] += temp_string;
            temp_string = '';
            isWriting = false;
            break;
        }
        if (isWriting)
            temp_string += value[i][j];
        else {
            if (value[i][j] != ' ') {
                temp_value += value[i][j];
            }
        }
    }
    if (temp_string == '') {
        if (temp_value == 'true') {
            value[i] = null;
            value[i] = true;
        }
        else if (temp_value == 'false') {
            value[i] = null;
            value[i] = false;
        }
        else {
            value[i] = null;
            value[i] = Number(temp_value);
        }
    }
    else {
        value[i] = '';
        value[i] += temp_string;
        temp_string = '';
    }

}

for (let i = 0; i < key.length; i++) {
    console.log('"' + key[i] + '": ' + value[i]);
}


/*


var a = JSON.parse(string_from_network);

console.log("Name:", a.name);
console.log("Age:", a.age);
console.log("City:", a.city);





var j_name = [];
var j_age = 0;
var j_city = [];

var result_key = [];
var result_value = [];

var isParsing = false;
var isReadingKeyword = false;
var isReadingValue = false;

for(let i=0;i<string_from_network.length;i++)
{
    if(string_from_network[i] == '{')
    {
        isParsing = true;
    }
    else if(string_from_network[i] == '"')
    {
        isReadingKeyword = (!isReadingKeyword);
        continue;
    }
    else if(string_from_network[i] == ':')
    {
        isReadingValue = true;       
        continue; 
    }
    else if(string_from_network[i] == ',' || string_from_network[i] == '}')
    {
        //끝났으니
        if(result_key.join('') === 'name')
            j_name = result_value.join('');
        else if(result_key.join('') === 'age')
            j_age = Number(result_value.join(''));
        else if(result_key.join('') === 'city')
            j_city = result_value.join('');

        result_value.length = 0;
        result_key.length = 0;
        isReadingValue = false;
        
        if(string_from_network[i] == '}')
        {
            isParsing = false;
            
        }

        continue;
    } 

    if(isParsing)
    {
        if(isReadingKeyword)
        {
            if(isReadingValue)
                result_value.push(string_from_network[i]);
            else
                result_key.push(string_from_network[i]);
        }
        else
        {
            if(isReadingValue && string_from_network[i] != ' ')
                result_value.push(string_from_network[i]);
        }
    }

    
}

console.log(j_name);
console.log(j_age);
console.log(j_city);
*/