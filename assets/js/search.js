$(function() {
    $("#Datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        dayNames: ['일','월','화','수','목','금','토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        yearSuffix: '년',
        showMonthAfterYear: true,
        maxDate : 0
    });
});


function his_(id_) {
    var form = document.createElement("form");
    form.setAttribute ( "charset", "UTF-8");
    form.action = "/togeneric";
    form.method = "POST";

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "id_");
    hiddenField.setAttribute("value", id_);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}

function arts(reason) {
    alert("상세사유 : \n\n"+reason);
}

function click_search(tmp_id) {
    var tmp_day = document.getElementsByName("date_")[0].value;
    var form = document.createElement("form");
    form.setAttribute ( "charset", "UTF-8");
    form.action = "/tosearch";
    form.method = "POST";

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "id_");
    hiddenField.setAttribute("value", tmp_id);
    form.appendChild(hiddenField);

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "date_");
    hiddenField.setAttribute("value", tmp_day);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}