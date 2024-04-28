




function getDataComplaint() {
    axios({
        method: 'get',
        url: `${baseURL}/complaint`,
        headers
    }).then(function (response) {
        const {  Complaints } = response.data
        showDataComplaint(Complaints)
    }).catch(function (error) {
        console.log(error);
    });
}


function showDataComplaint(Complaints = []) {
    let table = ``
    console.log({ Complaints });
    for (let index = 0; index < Complaints.length; index++) {
        
        table += `  <tr>
        <td >${Complaints[index]._id}</td>
            <td>${Complaints[index].email}</td>
           <td>${Complaints[index].complaint}</td>
           <td>${Complaints[index].role}</td>
          <td>
          <button onclick='reply("${Complaints[index]._id}")' class="btn btn-danger">reply</button>
           
            </td>
          
         
        </tr>`
        
    }
    document.getElementById('tb2').innerHTML = table
}


getDataComplaint()


//
// redirect to reply complaint page
function reply(id) {
    localStorage.setItem("complaintId", id)
    window.location.href = 'replyComplaint.html';

}



