const baseURL = 'http://localhost:5000'
// start Display data
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': `Hamada__${localStorage.getItem("access_Token")}`
}
//approve doctor data from Admin
function getData() {
    axios({
        method: 'get',
        url: `${baseURL}/admin/isApprovedFalse`,
        headers
    }).then(function (response) {
        const {  doctors } = response.data
        showData(doctors)
    }).catch(function (error) {
        console.log(error);
    });
}


function showData(doctors = []) {
    let table = ``
    console.log({ doctors });
    for (let index = 0; index < doctors.length; index++) {
        
        table += `  <tr>
        <td id="DoctorId">${doctors[index]._id}</td>
        
        <td id="DoctorId">${doctors[index].firstName}</td>
        
        <td id="DoctorId">${doctors[index].lastName}</td>
        
        <td id="DoctorId">${doctors[index].email}</td> 
        
        <td id="emailDoctor">${doctors[index].clinicAddress}</td>
        <td id="emailDoctor">${doctors[index].phone_one}</td>
         
        <td>  <img src="${doctors[index].certificate.secure_url}" class="w-50" alt=""> </td> 
         <td>  <img src="${doctors[index].unionCard.url}" class="w-50" alt=""></td>
          <td>${doctors[index].specialization}</td>
           
          <td>
          <button onclick='accept("${doctors[index]._id}")' class="btn btn-danger">accept</button>
           
            </td>
            <td>
            <button onclick='reject("${doctors[index]._id}")' class="btn btn-danger">reject</button>
             
              </td>
         
        </tr>`
        
    }
    document.getElementById('tb').innerHTML = table
}


getData()
// End Display data



//approved admin


function accept(id) {

    axios({
        method: 'put',
        url: `${baseURL}/admin/approve/adminTrue/${id}`,
        headers
    })
    getData()
}

function reject(doctorId) {

    axios({
        method: 'delete',
        url: `${baseURL}/Doctor/${doctorId}`,
        headers
    })
    getData()
}









$("#reject").click(() => {
    const data = {
        title: $('#title').val(),
        }
    axios({
        method: 'put',
        url: `${baseURL}/admin/approve/adminTrue/:doctorId`,
        data:data,
        headers
    }).then(function (response) {
        console.log(response.data);
        const { message } = response.data
        if (message == "Done Approved") {
            alert("approved successfully")
            
        } else {
            alert("Fail to approvied your note")
        }
    }).catch(function (error) {
        console.log(error);
    });
})


