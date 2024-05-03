const baseURL = 'http://localhost:5000'
$("#loginDoctor").click(() => {
    const email = $("#email").val();
    const password = $("#password").val();
    const data = {
        email,
        password
    }
    console.log({ data });
    axios({
        method: 'post',
        url: `${baseURL}/doctor/loginDoctor`,
        data: data,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(function (response) {
        console.log({ response });
        const { message, access_Token,refresh_token } = response.data
        if (message == "Done") {
            localStorage.setItem('access_Token', access_Token);
           window.location.href = 'homeDoctor.html';
        } else {
            console.log("In-valid email or password");
           // alert("In-valid email or password")
        }
    }).catch(function (error) {
        console.log(error);
    });

})
