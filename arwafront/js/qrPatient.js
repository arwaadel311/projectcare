const baseURL = 'http://localhost:5000'

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': `Hamada__${localStorage.getItem("access_Token")}`
}
//approve doctor data from Admin
function getDataQR() {
    axios({
        method: 'patch',
        url: `${baseURL}/patient/patientQR`,
        headers
    }).then(function (response) {
        console.log({ response });
        const { message, url } = response.data

showDataQR(url)
   } ).catch(function (error) {
        console.log(error);
    });
}





function showDataQR(url=[]) {
    let table = ``
    console.log({ url });
    //for (let index = 0; index < url.length; index++) {
        
        table += `  <tr>
        
        <td >
        <img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"src="${url}">
        </td>
         </tr> `
        
    //}
    document.getElementById('t2').innerHTML = table
}



getDataQR()
// End Display data

