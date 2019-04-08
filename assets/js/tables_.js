function art(reason) {
    alert("상세사유\n\n"+reason);
}

function send_ctf() {
    var ctf_time = document.getElementsByName("ctf_time")[0];
    var place_sel = document.getElementsByName("ctf_place")[0];
    var place_ = place_sel.options[place_sel.selectedIndex];
    var g_l_sel = document.getElementsByName("g_l")[0];
    var g_l_ = g_l_sel.options[g_l_sel.selectedIndex];
    var reason_ = document.getElementsByName("ctf_reason")[0];
    if(ctf_time.value == "") {
        alert("돌아오는 시간을 입력하세요.");
        return false;
    }
    if(ctf_time.value.length > 50) {
        alert("돌아오는 시간은 최대 50자까지 입력 가능합니다.");
        return false;
    }
    if(place_.value == "") {
        alert("장소를 선택하세요.");
        return false;
    }
    if(g_l_.value == "") {
        alert("외출인지 조퇴인지 선택하세요.");
        return false;
    }
    if(place_.value == "기타" && reason_.value == "") {
        alert("외출사유가 기타일 경우 사유를 입력해야 합니다.");
        return false;
    }
    reason_.value = reason_.value.replace('\n', ' ');
    return true;
}
function send_ctf_form() {
    var em_id = document.getElementsByName("emt_id")[0].innerHTML;
    if(send_ctf()) {
        var f = document.getElementsByName("ctf_form")[0];
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "stu_id");
        hiddenField.setAttribute("value", em_id);
        f.appendChild(hiddenField);
        f.action="/ctf_go";
        f.method="POST";
        f.submit();
    }
}