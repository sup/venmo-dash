$(document).ready(function() {

$.ajax({
    type: "GET",
    url: "/friends"
})
.done(function(data) {
    console.log(JSON.stringify(data));
})
.fail(function() {
    console.log("FAILED");
});


});
