function arts(reason) {
    alert("상세사유 : \n\n"+reason);
}

function approve(i, code_) {
    var id_ = document.getElementsByName("gnc_id")[0].innerHTML;

    var form = document.createElement("form");
    form.setAttribute ( "charset", "UTF-8");
    form.action = "/ctf_apr";
    form.method = "POST";

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "std_by");
    hiddenField.setAttribute("value", i);
    form.appendChild(hiddenField);
    
    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "code_");
    hiddenField.setAttribute("value", code_);
    form.appendChild(hiddenField);

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "id_");
    hiddenField.setAttribute("value", id_);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}

function post_search() {
    var id_ = document.getElementsByName("gnc_id")[0].innerHTML;
    var form = document.createElement("form");
    form.setAttribute ( "charset", "UTF-8");
    form.action = "/generic_search";
    form.method = "POST";

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "id_");
    hiddenField.setAttribute("value", id_);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}