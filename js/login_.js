//학생 유효성 검사
function sendStu() {
    var idbox = document.getElementsByName("my_id")[0];
    var pwbox = document.getElementsByName("my_pwd")[0];
    var pwchkbox = document.getElementsByName("my_pwd1")[0];
    var gradetarget = document.getElementsByName("grade")[0];
    var gradebox = gradetarget.options[gradetarget.selectedIndex];
    var clstarget = document.getElementsByName("cls")[0];
    var clsbox = clstarget.options[clstarget.selectedIndex];
    var numtarget = document.getElementsByName("number")[0];
    var numbox = numtarget.options[numtarget.selectedIndex];
    var namebox = document.getElementsByName("stuname")[0];
    var telbox = document.getElementsByName("tel")[0];
    //아이디 입력여부 검사
    if (idbox.value == "") {
        alert("아이디를 입력하지 않았습니다.");
        idbox.focus();
        return false;
    }
    //아이디 유효성 검사 (영문소문자, 숫자만 허용)
    for (i = 0; i < idbox.value.length; i++) {
        var ch = idbox.value.charAt(i);
        if (!(ch >= '0' && ch <= '9') && !(ch >= 'a' && ch <= 'z')&&!(ch >= 'A' && ch <= 'Z')) {
            alert("아이디는 대소문자, 숫자만 입력가능합니다.");
            idbox.focus();
            idbox.select();
            return false;
        }
    }
    //아이디 길이 체크 (6~10자)
    if (idbox.value.length<6 || idbox.value.length>12) {
        alert("아이디를 6~10자까지 입력해주세요.");
        idbox.focus();
        idbox.select();
        return false;
    }
    //비밀번호 입력여부 체크
    if (pwbox.value == "") {
        alert("비밀번호를 입력하지 않았습니다.");
        pwbox.focus();
        return false;
    }
    //아이디 비밀번호가 같은지 체크
    if (pwbox.value == idbox.value) {
        alert("아이디와 비밀번호가 같습니다.");
        pwbox.focus();
        return false;
    }
    //비밀번호 길이 체크(8~20자 까지 허용)
    if (pwbox.value.length<8 || pwbox.value.length>20) {
        alert("비밀번호를 8~20자까지 입력해주세요.");
        pwbox.focus();
        pwbox.select();
        return false;
    }
    
    //비밀번호와 비밀번호 확인 일치여부 체크
    if (pwbox.value != pwchkbox.value) {
        alert("비밀번호가 일치하지 않습니다")
        pwchkbox.value = "";
        pwchkbox.focus();
        return false;
    }
    //학년 select 입력여부 검사
    if(gradebox.value=="") {
        alert("학년을 선택해주세요.");
        gradebox.focus();
        return false;
    }
    //반 select 입력여부 검사
    if(clsbox.value=="") {
        alert("반을 선택해주세요.");
        clsbox.focus();
        return false;
    }
    //번호 select 입력여부 검사
    if(numbox.value=="") {
        alert("번호를 선택하세요.");
        numbox.focus();
        return false;
    }
    //이름 입력여부 검사
    if(namebox.value=="") {
        alert("이름을 입력하세요.");
        namebox.focus();
        namebox.select();
        return false;
    }
    if (namebox.value.length>20) {
        alert("이름을 20자 이하로 입력하세요.");
        namebox.focus();
        namebox.select();
        return false;
    }
    //전화번호 입력여부 검사
    if(telbox.value=="") {
        alert("전화번호를 입력하세요.");
        telbox.focus();
        telbox.select();
        return false;
    }
    if (telbox.value.length>15) {
        alert("전화번호 15자 이하로 입력하세요.");
        telbox.focus();
        telbox.select();
        return false;
    }
    for (i = 0; i < telbox.value.length; i++) {
        var ch = telbox.value.charAt(i);
        if (!(ch >= '0' && ch <= '9')) {
            alert("전화번호는 숫자만 입력가능합니다.");
            telbox.focus();
            telbox.select();
            return false;
        }
    }
    return true;
}

function stu_move () {
    if(sendStu()){
        var f = document.getElementsByName("stu_p")[0];
        f.action="/stupost";
        f.method="POST";
        f.submit()
    }
}



//관리자 유효성 검사
//관리자 유효성 검사

function sendTch() {
    var tchidbox = document.getElementsByName("tch_id")[0];
    var tchpwbox = document.getElementsByName("tch_pw")[0];
    var tchpwboxchk = document.getElementsByName("tch_chk_pw")[0];
    var tchgradetarget = document.getElementsByName("tch_grade")[0];
    var tchgradebox = tchgradetarget.options[tchgradetarget.selectedIndex];
    var tchclstarget = document.getElementsByName("tch_cls")[0];
    var tchclsbox = tchclstarget.options[tchclstarget.selectedIndex];
    var codebox = document.getElementsByName("code")[0];
    if (tchidbox.value == "") {
        alert("아이디를 입력하지 않았습니다.");
        tchidbox.focus();
        return false;
    }
    //아이디 유효성 검사 (영문소문자, 숫자만 허용)
    for (i = 0; i < tchidbox.value.length; i++) {
        var ch = tchidbox.value.charAt(i);
        if (!(ch >= '0' && ch <= '9') && !(ch >= 'a' && ch <= 'z')&&!(ch >= 'A' && ch <= 'Z')) {
            alert("아이디는 대소문자, 숫자만 입력가능합니다.");
            tchidbox.focus();
            tchidbox.select();
            return false;
        }
    }
    //아이디 길이 체크 (6~12자)
    if (tchidbox.value.length<6 || tchidbox.value.length>12) {
        alert("아이디를 6~10자까지 입력해주세요.");
        tchidbox.focus();
        tchidbox.select();
        return false;
    }
    //비밀번호 입력여부 체크
    if (tchpwbox.value == "") {
        alert("비밀번호를 입력하지 않았습니다.");
        tchpwbox.focus();
        return false;
    }
    //아이디 비밀번호가 같은지 체크
    if (tchpwbox.value == tchidbox.value) {
        alert("아이디와 비밀번호가 같습니다.");
        tchpwbox.focus();
        return false;
    }
    //비밀번호 길이 체크(8~20자 까지 허용)
    if (tchpwbox.value.length<8 || tchpwbox.value.length>20) {
        alert("비밀번호를 8~20자까지 입력해주세요.");
        tchpwbox.focus();
        tchpwbox.select();
        return false;
    }
    
    //비밀번호와 비밀번호 확인 일치여부 체크
    if (tchpwbox.value != tchpwboxchk.value) {
        alert("비밀번호가 일치하지 않습니다")
        tchpwboxchk.value = "";
        tchpwboxchk.focus();
        return false;
    }
    //학년 select 입력여부 검사
    if(tchgradebox.value=="") {
        alert("학년을 선택해주세요.");
        tchgradebox.focus();
        return false;
    }
    //반 select 입력여부 검사
    if(tchclsbox.value=="") {
        alert("반을 선택해주세요.");
        tchclsbox.focus();
        return false;
    }
    if(codebox.value=="") {
        alert("코드를 입력해주세요.");
        codebox.focus();
        codebox.select();
        return false;
    }
    if(codebox.value!="qwer1234") {
        alert("잘못된 코드입니다.");
        codebox.focus();
        codebox.select();
        return false;
    }
    return true;
}

function tch_move() {
    if(sendTch()){
        var f = document.getElementsByName("tch_p")[0];
        f.action="/tchpost";
        f.method="POST";
        f.submit();
    }
}