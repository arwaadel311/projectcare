const baseURL = 'http://localhost:5000'

$("#SocialLogin").click(() => {

    axios({
        method: 'get',
        url: `http://localhost:3000/google`,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(function (response) {
        console.log({ response });

    }).catch(function (error) {
        console.log(error);
    });

})








$("#signUpDoctor").click(() => {
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const clinicAddress = $("#clinicAddress").val();
    const phone_one = $("#phone_one").val();
    const phone_two = $("#phone_two").val();
    const specialization = $("#specialization").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const cPassword = $("#cPassword").val();
    const unionCard = $("#unionCard").val();
    
    const certificate = $("#certificate").val();
    const data = {
        
        firstName,
        lastName,
        clinicAddress,
        phone_one,
        phone_two,
        specialization,
        email,
        password,
        cPassword,
        unionCard,
        certificate
    }
    console.log({ data });

    axios({
        method: 'post',
        url: `${baseURL}/doctor/signupDoctor`,
        data: data,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(function (response) {
        console.log({ response });
        const { message } = response.data
        if (message == "Done") {
            window.location.href = 'doctorLogin.html';
        } else if (message == 'Email exist') {
            alert("Email exist")
        } else {
            console.log("Fail to signup");
            alert(message)
        }
    }).catch(function (error) {
        console.log(error);
    });

})






