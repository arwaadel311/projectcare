const baseURL = 'http://localhost:5000'
$("#loginPatient").click(() => {
    const email = $("#email").val();
    const password = $("#password").val();
    const data = {
        email,
        password
    }
    console.log({ data });
    axios({
        method: 'post',
        url: `${baseURL}/patient/loginPatient`,
        data: data,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(function (response) {
        console.log({ response });
        const { message, access_Token,refresh_token,patientID_token } = response.data
        if (message == "Done") {
            localStorage.setItem('access_Token', access_Token);
           window.location.href = 'homePatient.html';
        } else {
            console.log("In-valid email or password");
           // alert("In-valid email or password")
        }
    }).catch(function (error) {
        console.log(error);
    });

})
