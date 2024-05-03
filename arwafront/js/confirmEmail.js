const baseURL = 'http://localhost:5000'
$("#confirmEmail").click(() => {
    const emailCode = $("#emailCode").val();
   const data = {
    emailCode
    }
    console.log({ data });
    axios({
        method: 'put',
        url: `${baseURL}/patient/confirmEmailPatient`,
        data: data,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(function (response) {
        console.log({ response });
        const { message } = response.data
        if (message == "Done") {
            
           window.location.href = 'patientLogin.html';
        } else {
            console.log("In-valid emailCode");
           // alert("In-valid email or password")
        }
    }).catch(function (error) {
        console.log(error);
    });

})
