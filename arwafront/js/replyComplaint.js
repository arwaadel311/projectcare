const baseURL = 'http://localhost:5000'
// start Display data
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': `Hamada__${localStorage.getItem("access_Token")}`
}

function send() {
    const data = {
        description : $('#description').val(),
        }
    axios({
        method: 'post',
        url: `${baseURL}/complaint/feedbackComplaint/${complaintId}`,  
        data:data,
        headers
    })
    .then(function (response) {
        console.log(response.data);
        const { message } = response.data
        if (message == "Done reply") {
            alert("successfully")
            
        } else {
            alert("Fail")
        }
    }).catch(function (error) {
        console.log(error);
    });
}