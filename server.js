var express = require('express');   //웹서버 사용
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs'); //파일 로드 사용
var mysql = require('mysql');
var ejs = require('ejs');


//app.set('view engine','ejs');
app.set('views', './');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname, + '/public'));
console.log(__dirname);

//포트 설정
app.listen(3303, function() {
    console.log('Server start');
});

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qwer1234',
    port     : 3306,
    database : 'dbusers',    
    dateStrings : 'date'
});

  connection.connect(function(err) {
    if(err){
        console.log(err.code); // 'ECONNREFUSED'
        console.log(err.fatal); // true
    }
  });

//라우팅 설정
app.get('/',function (req, res) {
    fs.readFile('index.html',function(error,data) {  //  index.html 파일 로드
        if(error) {
            console.log(error);
        }else {
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);  //로드 html response
        }
    });
});

//미들웨어 함수에 대한 HTTP 요청 인수(일반적으로 "req"라 불림).
//미들웨어 함수에 대한 HTTP 응답 인수(일반적으로 "res"라 불림).
//미들웨어 함수에 대한 콜백 인수(일반적으로 "next"라 불림).

//로그인 함수
app.post('/elements', function(req, res) {
    var id_ = req.body.id_id;
    var pw_ = req.body.pwd_pwd;
    var job_ = req.body.job_job;
    var ctf_;
    
    if(job_ == "student") {
        var result = false;
        connection.query('select * from student', function(err, rows) {
            if(err) throw err;
            for(var i = 0;i<rows.length;i++){
                if(id_ == rows[i].Stu_id && pw_ == rows[i].Stu_pw) {
                    ctf_ = rows[i].Ctf_num;
                    result = true;
                    break;
                }
            }
            if(result) {
                connection.query('select * from list where stu_id = "'+id_+'" order by day desc', function(error, lists) {
                    if(error) throw error;
                    var json_ = {
                        id : id_,
                        lists_ : []
                    };
                    var snd;
                    for(var i = 0;i<lists.length;i++) {
                        if(lists[i].Standby == 0) snd = "대기";
                        else if(lists[i].Standby == 1) snd = "수락";
                        else if(lists[i].Standby == 2) snd = "거절";
                        var json_arr = {
                            day : lists[i].Day,
                            Reason : lists[i].Reason,
                            Content : lists[i].Content,
                            g_l : lists[i].g_l,
                            Standby : snd,
                            Arv_time : lists[i].Arv_time
                        }
                        json_['lists_'].push(json_arr);
                    }
                    json_.ctf_num = ctf_;
                    fs.readFile('elements.ejs','utf-8',function (err_, data) {
                        if(err_) throw err_;
                        res.writeHead(200,{'Content-Type':'text/html'});
                        res.end(ejs.render(data, json_));
                    });
                });
            }
            else {
                res.send('<script>alert("아이디 또는 비밀번호가 일치하지 않습니다"); history.back();</script>');
            }
        });
    }
    if(job_ == "admin") {
        if(id_ == "gsmadmin") {
            if(pw_ == "qwer1234") {
                connection.query('select * from list where Standby = 0', function (error, lists){
                    if(error) throw error;
                    var json_ = {
                        id : id_,
                        lists_ : []
                    };
                    connection.query('select * from student', function (error_, temp_) {
                        if(error_) throw error_;
                        //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                        for(var i = 0;i<lists.length;i++) {
                            var stu_name;
                            for (var j = 0;j<temp_.length;j++) {
                                if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                            }
                            var json_arr = {
                                stu_name_ : stu_name,
                                Reason : lists[i].Reason,
                                Content : lists[i].Content,
                                Arv_time : lists[i].Arv_time,
                                g_l : lists[i].g_l,
                                code_ : lists[i].Code
                            }
                            json_['lists_'].push(json_arr);
                        }
                        fs.readFile('generic.ejs','utf-8',function (err_, data) {
                            if(err_) throw err_;
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.end(ejs.render(data, json_));
                        });
                    });
                });
            }
        }
    
        else{
            var result = false;
            connection.query('select * from teacher', function(err, rows) {
                if(err) throw err;
                for(var i = 0;i<rows.length;i++){
                    if(id_ == rows[i].Tch_id && pw_ == rows[i].Tch_pw) {
                        result = true;
                        break;
                    }
                }
                if(result) {
                    var dt = new Date();
                    var month =dt.getMonth()+1;
                    var day = dt.getDate();
                    var year = dt.getFullYear();
                    var day_ = year+'-'+month+'-'+day;
                    var json_ = {
                        id : id_,
                        lists_ : []
                    };
                    connection.query('select * from list where Day = "'+day_+'" && Standby = 0 && Tch_id = "'+id_+'"', function(error, lists) {
                        if(error) throw error;
                        connection.query('select * from student', function (error_, temp_) {
                            if(error_) throw error_;
                            //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                            for(var i = 0;i<lists.length;i++) {
                                var stu_name;
                                for (var j = 0;j<temp_.length;j++) {
                                    if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                                }
                                var json_arr = {
                                    stu_name_ : stu_name,
                                    Reason : lists[i].Reason,
                                    Content : lists[i].Content,
                                    Arv_time : lists[i].Arv_time,
                                    g_l : lists[i].g_l,
                                    code_ : lists[i].Code
                                }
                                json_['lists_'].push(json_arr);
                            }
                            fs.readFile('generic.ejs','utf-8',function (err_, data) {
                                if(err_) throw err_;
                                res.writeHead(200,{'Content-Type':'text/html'});
                                res.end(ejs.render(data, json_));
                            });
                        });
                    });
                }
                else {
                    res.send('<script>alert("아이디 또는 비밀번호가 일치하지 않습니다"); history.back();</script>');
                }
            });
        }
    }
 });

 //학생 회원가입
 app.post('/stupost', function(req,res) {
    S_id = req.body.my_id;
    S_pw = req.body.my_pwd;
    S_grade = req.body.grade;
    S_cls = req.body.cls;
    S_num = req.body.number;
    S_name = req.body.stuname;
    S_tel = req.body.tel;
    var result = false;
    connection.query('select * from student', function (err, rows) {
        if(err) throw err;
        for(var i =0;i<rows.length;i++)
        {
            if(S_id == rows[i].Stu_id)
            {
                result = true;
                break;
            }
        }
        if(result) {
            res.send('<script>alert("이미 존재하는 아이디입니다"); history.back();</script>');
        }else{
            for(var i =0;i<rows.length;i++)
            {
                if(S_grade == rows[i].Grade && S_cls == rows[i].Class && S_num == rows[i].Number)
                {
                    result = true;
                    break;
                }
            }
            if(result) {
                res.send('<script>alert("이미 존재하는 학번입니다"); history.back();</script>');
            }
            else {
                connection.query('select * from teacher', function(err, rows1) {
                    var admin;
                    if(err) throw err;
                    for(var i = 0;i<rows1.length;i++) {
                        if(S_grade == rows1[i].Tch_grade && S_cls == rows1[i].Tch_class) {
                            admin = rows1[i].Tch_id;
                            result = true;
                            break;
                        }
                    }
                    if(result) {
                        //Stu_id, Stu_pw, Grade, Class, Number, Name, Tel, Ctf_num, Tch_id
                        connection.query('insert into student values("'+S_id+'", "'+S_pw+'", '+S_grade+', '+S_cls+', '+S_num+', "'+S_name+'", "'+S_tel+'", 2, 1, "'+admin+'")',function(err, rows2) {
                            if(err) throw err;
                            res.send('<script>alert("회원가입 성공"); location.href = "login.html";</script>');
                        });
                    }
                    else {
                        res.send('<script>alert("해당 관리자가 없습니다"); history.back();</script>');
                    }
                });
            }
        }
    });
 });

 //관리자 회원가입
 app.post('/tchpost', function(req,res) {
    T_id = req.body.tch_id;
    T_pw = req.body.tch_pw;
    T_grade = req.body.tch_grade;
    T_cls = req.body.tch_cls;
    T_code = req.body.code;
    var result = false;
    connection.query('select * from teacher', function (err, rows) {
        if(err) throw err;
        for(var i = 0; i<rows.length;i++)
        {
            if(T_id == rows[i].Tch_id)
            {
                result = true;
                break;
            }
        }
        if(result){
            res.send('<script>alert("이미 존재하는 아이디입니다"); history.back();</script>');
        }
        else{
            for(var i = 0;i<rows.length;i++){
                if(T_grade == rows[i].Tch_grade && T_cls == rows[i].Tch_class){
                    result = true;
                    break;
                }
            }
            if(result) {
                res.send('<script>alert("해당 관리자가 이미 존재합니다"); history.back();</script>');
            }
            else{
                connection.query('insert into teacher values ("'+T_id+'", "'+T_pw+'",'+T_grade+', '+T_cls+')', function(err, rows_) {
                    if(err) throw err;
                    res.send('<script>alert("회원가입 성공"); location.href = "login.html";</script>');
                });
            }
        }
    });
});

//학생의 외출증 전송
app.post('/ctf_go', function(req, res) {
    var ctf_time = req.body.ctf_time;
    var ctf_place = req.body.ctf_place;
    var g_l = req.body.g_l;
    var ctf_reason = req.body.ctf_reason;
    var stu_id = req.body.stu_id;
    var ctf_num_;
    connection.query('select * from student where stu_id = "'+stu_id+'"', function(err, rows) {
        if(err) throw err;
        if(rows[0].Ctf_num<=0 || rows[0].every_ <= 0) {
            res.send('<script>alert("외출증을 보낼 수 없습니다."); history.back();</script>');
            res.end();
        }
        else{
            ctf_num_ = rows[0].Ctf_num;
            stu_grade = rows[0].Grade;
            stu_cls = rows[0].Class;
            connection.query('select * from teacher where Tch_grade = '+stu_grade+' && Tch_class = '+stu_cls, function(err1, rows1) {
                if(err1) throw err1;
                var tch_id = rows1[0].Tch_id;
                var dt = new Date();
                var month =dt.getMonth()+1;
                var day = dt.getDate();
                var year = dt.getFullYear();
                var day_ = year+'-'+month+'-'+day;
                var code_;
                connection.query('select * from list where stu_id = "'+stu_id+'"', function (err2, rows2) {
                    if(err2) throw err2;
                    code_=stu_id+"_"+rows2.length;
                    connection.query('insert into list values("'+day_+'", "'+code_+'", "'+ctf_place+'", "'+ctf_reason+'", "'+g_l+'", 0, "'+ctf_time+'", "'+stu_id+'", "'+tch_id+'")', function(err3, rows3) {
                        if(err3) throw err3;
                        connection.query('select * from student where stu_id = "'+stu_id+'"', function (err4, rows4) {
                            if(err4) throw err4;
                            connection.query('select * from list where stu_id ="'+stu_id+'"', function (error, listrow) {
                                if(error) throw error;
                                connection.query('update student set every_ = 0 where stu_id = "'+stu_id+'"', function(enderr, endview) {
                                    if(enderr) throw enderr;
                                    connection.query('select * from list where stu_id = "'+stu_id+'" order by day desc', function(error, lists) {
                                        if(error) throw error;
                                        var json_ = {
                                            id : stu_id,
                                            lists_ : []
                                        };
                                        var snd;
                                        for(var i = 0;i<lists.length;i++) {
                                            if(lists[i].Standby == 0) snd = "대기";
                                            else if(lists[i].Standby == 1) snd = "수락";
                                            else if(lists[i].Standby == 2) snd = "거절";
                                            var json_arr = {
                                                day : lists[i].Day,
                                                Reason : lists[i].Reason,
                                                Content : lists[i].Content,
                                                g_l : lists[i].g_l,
                                                Standby : snd,
                                                Arv_time : lists[i].Arv_time
                                            }
                                            json_['lists_'].push(json_arr);
                                        }
                                        json_.ctf_num = ctf_num_;
                                        fs.readFile('elements.ejs','utf-8',function (err_, data) {
                                            if(err_) throw err_;
                                            res.writeHead(200,{'Content-Type':'text/html'});
                                            res.write('<script>alert("외출증을 정상적으로 전송했습니다");</script>');
                                            res.end(ejs.render(data, json_));
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    });
});

//관리자 승인, 거부
app.post('/ctf_apr', function(req,res) {
    var code_ = req.body.code_;
    var std_by = req.body.std_by;
    var id_ = req.body.id_;

    var dt = new Date();
    var month =dt.getMonth()+1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var day_ = year+'-'+month+'-'+day;

    connection.query('update list set Standby = '+std_by+' where Code = "'+code_+'"', function(err, rows) {
        if(err) throw err;
        
        var json_ = {
            id : id_,
            lists_ : []
        };

        //관리자
        if(id_ == "gsmadmin") {
            connection.query('select * from list where Standby = 0', function (error, lists){
                if(error) throw error;
                var json_ = {
                    id : id_,
                    lists_ : []
                };
                connection.query('select * from student', function (error_, temp_) {
                    if(error_) throw error_;
                    //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                    for(var i = 0;i<lists.length;i++) {
                        var stu_name;
                        for (var j = 0;j<temp_.length;j++) {
                            if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                        }
                        var json_arr = {
                            stu_name_ : stu_name,
                            Reason : lists[i].Reason,
                            Content : lists[i].Content,
                            Arv_time : lists[i].Arv_time,
                            g_l : lists[i].g_l,
                            code_ : lists[i].Code
                        }
                        json_['lists_'].push(json_arr);
                    }
                    if(std_by == 1) {
                        var code_spl=code_.split('_');  //학생 아이디
                        connection.query('update student set ctf_num = ctf_num-1 where stu_id = "'+code_spl[0]+'"', function(err9, rows) {
                            if(err9) throw err9;
                            fs.readFile('generic.ejs','utf-8',function (err_, data) {
                                if(err_) throw err_;
                                res.writeHead(200,{'Content-Type':'text/html'});
                                res.end(ejs.render(data, json_));
                            });
                        });
                    }
                    else{
                        fs.readFile('generic.ejs','utf-8',function (err_, data) {
                            if(err_) throw err_;
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.end(ejs.render(data, json_));
                        });
                    }
                });
            });
        }

        else{
            //일반선생님
            connection.query('select * from list where Day = "'+day_+'" && Standby = 0 && Tch_id = "'+id_+'"', function(error, lists) {
                if(error) throw error;
                connection.query('select * from student', function (error_, temp_) {
                    if(error_) throw error_;
                    //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                    for(var i = 0;i<lists.length;i++) {
                        var stu_name;
                        for (var j = 0;j<temp_.length;j++) {
                            if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                        }
                        var json_arr = {
                            stu_name_ : stu_name,
                            Reason : lists[i].Reason,
                            Content : lists[i].Content,
                            Arv_time : lists[i].Arv_time,
                            g_l : lists[i].g_l,
                            code_ : lists[i].Code
                        }
                        json_['lists_'].push(json_arr);
                    }
                    if(std_by == 1) {
                        var code_spl=code_.split('_');  //학생 아이디
                        connection.query('update student set ctf_num = ctf_num-1 where stu_id = "'+code_spl[0]+'"', function(err9, rows) {
                            if(err9) throw err9;
                            fs.readFile('generic.ejs','utf-8',function (err_, data) {
                                if(err_) throw err_;
                                res.writeHead(200,{'Content-Type':'text/html'});
                                res.end(ejs.render(data, json_));
                            });
                        });
                    }
                    else{
                        fs.readFile('generic.ejs','utf-8',function (err_, data) {
                            if(err_) throw err_;
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.end(ejs.render(data, json_));
                        });
                    }
                });
            });
        }
    });
});







//관리자 조회 페이지로 이동
app.post('/generic_search', function( req, res) {
    var id_ = req.body.id_;
    var dt = new Date();
        var month =dt.getMonth()+1;
        var day = dt.getDate();
        if(day<=9) day = "0" + day;
        var year = dt.getFullYear();
        var day_ = year+'-'+month+'-'+day;
    var json_ = {
        id : id_,
        day : day_,
        lists_ : []
    };
    if(id_ == "gsmadmin") {
        connection.query('select * from list where Day = "'+day_+'"', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var snd;
                    if(lists[i].Standby == 0) snd = "대기";
                    else if(lists[i].Standby == 1) snd = "수락";
                    else if(lists[i].Standby == 2) snd = "거절";
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        std_by : snd
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('search.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
    else{
        connection.query('select * from list where Day = "'+day_+'" && Tch_id = "'+id_+'"', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var snd;
                    if(lists[i].Standby == 0) snd = "대기";
                    else if(lists[i].Standby == 1) snd = "수락";
                    else if(lists[i].Standby == 2) snd = "거절";
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        std_by : snd
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('search.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
});

//관리자 승인, 거부 페이지로 이동
app.post('/togeneric', function(req, res) {
    var id_ = req.body.id_;
    var dt = new Date();
    var month =dt.getMonth()+1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var day_ = year+'-'+month+'-'+day;
    var json_ = {
        id : id_,
        lists_ : []
    };
    if(id_ == "gsmadmin"){
        connection.query('select * from list where Day = "'+day_+'" && Standby = 0', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        code_ : lists[i].Code
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('generic.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
    else {
        connection.query('select * from list where Day = "'+day_+'" && Standby = 0 && Tch_id = "'+id_+'"', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                //신청자, 장소, 상세사유, 외출시간, 외출/조퇴, 코드
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        code_ : lists[i].Code
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('generic.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
});

//관리자 조회 버튼 이벤트
app.post('/tosearch', function(req, res) {
    var id_ = req.body.id_;
    var day_ = req.body.date_;
    var json_ = {
        id : id_,
        day : day_,
        lists_ : []
    };

    if(id_ == "gsmadmin") {
        connection.query('select * from list where Day = "'+day_+'"', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var snd;
                    if(lists[i].Standby == 0) snd = "대기";
                    else if(lists[i].Standby == 1) snd = "수락";
                    else if(lists[i].Standby == 2) snd = "거절";
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        std_by : snd
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('search.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
    else {
        connection.query('select * from list where Day = "'+day_+'" && Tch_id = "'+id_+'"', function(error, lists) {
            if(error) throw error;
            connection.query('select * from student', function (error_, temp_) {
                if(error_) throw error_;
                for(var i = 0;i<lists.length;i++) {
                    var stu_name;
                    for (var j = 0;j<temp_.length;j++) {
                        if(lists[i].Stu_id == temp_[j].Stu_id) stu_name = temp_[j].Name;
                    }
                    var snd;
                    if(lists[i].Standby == 0) snd = "대기";
                    else if(lists[i].Standby == 1) snd = "수락";
                    else if(lists[i].Standby == 2) snd = "거절";
                    var json_arr = {
                        stu_name_ : stu_name,
                        Reason : lists[i].Reason,
                        Content : lists[i].Content,
                        Arv_time : lists[i].Arv_time,
                        g_l : lists[i].g_l,
                        std_by : snd
                    }
                    json_['lists_'].push(json_arr);
                }
                fs.readFile('search.ejs','utf-8',function (err_, data) {
                    if(err_) throw err_;
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(ejs.render(data, json_));
                });
            });
        });
    }
});




//로그아웃
app.get('/element/logout', function (req, res) {
    res.send('<script>alert("로그아웃합니다"); location.href = "../index.html";</script>');
});
app.get('/generic/logout', function(req, res) {
    res.send('<script>alert("로그아웃합니다"); location.href = "../index.html";</script>');
});