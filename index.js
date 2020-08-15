var employeeData = [{ "id": 4, "jobTitleName": "Developer", "firstName": "Arya", "lastName": "Stark", "preferredFullName": "Arya Stark", "employeeCode": "E4", "region": "CA", "dob": "01/10/1993", "phoneNumber": "408-1234567", "emailAddress": "arya.stark@gmail.com" }, { "id": 5, "jobTitleName": "Developer", "firstName": "Sansa", "lastName": "Stark", "preferredFullName": "Sansa Stark", "employeeCode": "E5", "region": "CA", "dob": "01/10/1992", "phoneNumber": "408-1111111", "emailAddress": "sansa.stark@gmail.com" }, { "id": 6, "jobTitleName": "Developer", "firstName": "Rob", "lastName": "Stark", "preferredFullName": "Rob Stark", "employeeCode": "E6", "region": "CA", "dob": "01/10/1992", "phoneNumber": "408-1111111", "emailAddress": "rob.stark@gmail.com" }, { "id": 7, "jobTitleName": "Developer", "firstName": "Jon", "lastName": "Snow", "preferredFullName": "Jon Snow", "employeeCode": "E7", "region": "CA", "dob": "01/10/1992", "phoneNumber": "408-1111111", "emailAddress": "jon.snow@gmail.com" }, { "id": 8, "jobTitleName": "Program Directory", "firstName": "Ned", "lastName": "Stark", "dob": "05/12/1975", "preferredFullName": "Ned Stark", "employeeCode": "E8", "region": "CA", "phoneNumber": "408-2222222", "emailAddress": "ned.stark@gmail.com" }, { "id": 9, "jobTitleName": "Program Directory", "firstName": "Cat", "lastName": "Stark", "dob": "05/12/1975", "preferredFullName": "Cat Stark", "employeeCode": "E9", "region": "CA", "phoneNumber": "408-2222222", "emailAddress": "cat.stark@gmail.com" }, { "id": 10, "jobTitleName": "Program Directory", "firstName": "Tyrion", "lastName": "Lannister", "dob": "05/12/1975", "preferredFullName": "Tyrion Lannister", "employeeCode": "E10", "region": "CA", "phoneNumber": "408-2222222", "emailAddress": "tyrion.lannister@gmail.com" }]

var tableMap = {
  id: 'ID',
  jobTitleName: 'Job Title',
  firstName: 'First Name',
  lastName: 'Last Name',
  dob: 'Date of Birth',
  preferredFullName: 'Full Name',
  employeeCode: 'Emp Code',
  region: 'Region',
  phoneNumber: 'Contact',
  emailAddress: 'Email'

}

var currentColumnFilter = '';
var currentSortOrder = 'asc';
var totalCount = 0;
var pageSize = 8;
var previousPageSize = 0;
var startIndex = 0, endIndex = pageSize;
var allEmployeeData = [];
var currentPageData = [];

loadData = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    let table = document.querySelector("table");
    if (this.readyState == 4 && this.status == 200) {
      let resp = JSON.parse(this.response)[0];
      let data = Object.keys(tableMap);
      employeeData = [...resp, ...employeeData];
      allEmployeeData = employeeData;
      totalCount = employeeData.length;
      employeeData = employeeData.slice(startIndex, pageSize);
      generateTable(table, employeeData);
      generateTableHead(table, data);
    } else {
      document.getElementById('table-label-count').innerHTML = "Loading....";
    }

  };
  xhttp.open("GET", "https://my-json-server.typicode.com/darshanp40/employeedb/employees", true);
  xhttp.send();
}

generateTableHead = (table, data) => {
  document.getElementById('table-label-count').innerHTML = 'Total Employees :' + allEmployeeData.length;
  let thead = table.createTHead();
  let row = thead.insertRow();
  let headerKeys = [];
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(tableMap[key]);
    headerKeys.push(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

generateTable = (table, data) => {
  table.innerHTML = '';
  for (let element of data) {
    let row = table.insertRow();
    for (key in tableMap) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      if (key == "employeeCode") {
        let anchor = '<a href ="#" onclick="showCurrentRecord(this)">' + element[key] + '</a>';
        cell.innerHTML = anchor;
      } else {
        cell.appendChild(text);
      }
    }
  }
}

dropdownGenerator = (columnNames) => {
  const selectFilter = document.getElementById('column-filter-dropdown');
  for (var i = 0; i < columnNames.length; i++) {
    var opt = columnNames[i];
    var el = document.createElement("option");
    el.className = 'dropdown-item';
    el.selected = false;
    el.onclick = (opt) => { currentColumnFilter = opt.target.value };
    el.textContent = tableMap[opt];
    el.value = opt;
    if (i === 0) { el.selected = true; currentColumnFilter = opt; }
    selectFilter.appendChild(el);
  }
}

searchData = (keyword) => {

  let filterValue = keyword.value;
  employeeData = []
  if (filterValue) {

    allEmployeeData.forEach(row => {
      let columnValue = row[currentColumnFilter];
      if (columnValue.toString().indexOf(filterValue) !== -1) {
        employeeData.push(row);
      }
    })
  } else {
    employeeData = allEmployeeData;
  }
  applyPagination(employeeData);
}

setFilterKey = (key) => {
  currentColumnFilter = key.value;
  setSortOrder(currentSortOrder);
}

setSortOrder = (key) => {
  currentSortOrder = key.value;
  if (currentSortOrder == 'asc') {
    allEmployeeData = allEmployeeData.sort( (a, b) => {
      return a[currentColumnFilter].toString().localeCompare(b[currentColumnFilter]);
    })
  } else {
    allEmployeeData = allEmployeeData.sort( (a, b) => {
      return b[currentColumnFilter].toString().localeCompare(a[currentColumnFilter]);
    })
  }

  applyPagination(allEmployeeData);
}

applyPagination = (tableData) => {
  startIndex = 0;
  endIndex = pageSize;
  let table = document.querySelector("table");
  let data = Object.keys(tableMap);

  employeeData = tableData.slice(startIndex, endIndex);

  generateTable(table, employeeData);
  generateTableHead(table, data);
}

navigateTable = (direction) => {
  let table = document.querySelector("table");
  let data = Object.keys(tableMap);

  if (direction && startIndex + pageSize <= allEmployeeData.length) {
    startIndex = startIndex + pageSize;

    if (endIndex + pageSize >= allEmployeeData.length) {
      endIndex = allEmployeeData.length
    } else {
      endIndex = endIndex + pageSize;
    }

    employeeData = allEmployeeData.slice(startIndex, endIndex);
  } else if (!direction && startIndex - pageSize >= 0) {
    startIndex = startIndex - pageSize;
    endIndex = endIndex - previousPageSize;
    employeeData = allEmployeeData.slice(startIndex, endIndex);
  }
  previousPageSize = employeeData.length;
  generateTable(table, employeeData);
  generateTableHead(table, data);
}


addEmployee = () => {

  let id = allEmployeeData.length + 1;
  let addedEmpId = document.getElementById("employeeId").value;

  if (!addedEmpId) {
    return false;
    alert('Enter employee ID');
  }

  let otherRecord = allEmployeeData.filter(record => record.employeeCode != addedEmpId);

  let request = {
    "id": id,
    "jobTitleName": document.getElementById("employeeJT").value,
    "firstName": document.getElementById("firstName").value,
    "lastName": document.getElementById("lastName").value,
    "preferredFullName": document.getElementById("firstName").value + document.getElementById("lastName").value,
    "employeeCode": addedEmpId,
    "region": document.getElementById("region").value,
    "dob": document.getElementById("employeeDOB").value,
    "phoneNumber": document.getElementById("employeePhoneNumber").value,
    "emailAddress": document.getElementById("employeeEmail").value
  };

  otherRecord.push(request);
  allEmployeeData = otherRecord;
  applyPagination(otherRecord);
  $('#createEmployee').modal('hide');

  alert('Employee Added Successfully');
}

deleteEmployee = () => {

  let deleteEmpId = document.getElementById("employeeIdDelete").value;

  if (!deleteEmpId) {
    return false;
    alert('Enter employee ID to delete');
  }

  let recordMatch = allEmployeeData.filter(record => record.employeeCode == deleteEmpId);

  if (recordMatch.length == 0) {
    console.log('record not present');
    alert('Employee ID not present');
    return false;
  }

  let otherRecord = allEmployeeData.filter(record => record.employeeCode != deleteEmpId);
  allEmployeeData = otherRecord;
  applyPagination(otherRecord);
  $('#deleteEmployee').modal('hide');
  alert('Employee deleted Successfully');
}

showCurrentRecord = (context) => {

  let fetchId = context.text;
  let fetchRecord = allEmployeeData.filter(record => record.employeeCode == fetchId);
  document.getElementById("employee-information").innerHTML = '';
  if (fetchRecord.length === 1) {
    let record = fetchRecord[0];
    let recordhtml = '<h5>Selected Employee Information </h5><br/>' + '<div class="row">' +
      '<div class="col-4"> ID :' + record.id + '</div>' + '<div class="col-4"> Job Title :' + record.jobTitleName + '</div>' +
      '<div class="col-4"> Employee Name :' + record.preferredFullName + '</div>' + '</div>' +
      '<div class="row">' +
      '<div class="col-4"> DOB :' + record.dob + '</div>' + '<div class="col-4"> Region :' + record.region + '</div>' +
      '<div class="col-4"> Email :' + record.emailAddress + '</div>' + '</div>';
    document.getElementById("employee-information").innerHTML = recordhtml;
  }
  console.log(context);
}

$('table').on('scroll', function () {
  $("table > *").width($("table").width() + $("table").scrollLeft());
});
$('form').serialize();

//8149596444
loadData();
dropdownGenerator(Object.keys(tableMap));