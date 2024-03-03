// DataTable Create
let table = $("#studentTable").DataTable({
    responsive: true
});

// For track to every student we give them unique id
let uniqueId = 0;

// For track to current student
let currentId = null;

// array of students
let arrayOfStudents = [];

$('#myForm').on('submit', function(event){
    event.preventDefault();

    if (validateName($('#fname').val()) && validateName($('#lname').val()) && validateEmail($('#email').val()) && AgeGreaterThan18() ){
        // when you click on edit button it's open the pop-up form using data-bs-target,
        // and currentId = id using editStudent(id) , so it's called submit addEventListener by default
        if (currentId) {
            updateStudent();
        } else {
            addStudent();
        }
    } else {
        alert("please enter valid details");
    }

});

// issue : when you click on add button after edit button it's show save button instead of submit button
$('#add').on('click', function(){
    $('#myForm').trigger('reset');
    $('#display_submit').css('display','block');
    $('#save').css('display','none');
});

function addStudent() {
    let firstName = $('#fname').val();
    let lastName = $('#lname').val();
    let dateOfBirth = $('#dob').val();
    let email = $('#email').val();
    let address = $('#address').val();
    let graduationYear = $('#graduation-year').val();

    // Create Student Object
    let student = {
        id: ++uniqueId,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        email: email,
        address: address,
        graduationYear: graduationYear,
        education: []
    }
    // Add all education row into Student Object
    $('#educ-body tr').each(function() {
        let degreeBoard = $(this).find('input[name="degreeBoard"]').val();
        let schoolCollage = $(this).find('input[name="schoolCollage"]').val();
        let startDate = $(this).find('input[name="startDate"]').val();
        let passoutYear = $(this).find('input[name="passoutYear"]').val();
        let percentage = $(this).find('input[name="percentage"]').val();
        let backlog = $(this).find('input[name="backlog"]').val();

        let educationObject = {
            degreeBoard: degreeBoard,
            schoolCollage: schoolCollage,
            startDate: startDate,
            passoutYear: passoutYear,
            percentage: percentage,
            backlog: backlog
        }
        // push one education row at a one time in education 
        student.education.push(educationObject);
    })
    arrayOfStudents.push(student);
    displayStudents();
    // reset the form
    // $('#myForm').trigger('reset');
}

function displayStudents() {
    //draw method doesn’t directly clear the data but triggers a re-rendering of the table based on the current state and data
    table.clear().draw();
    arrayOfStudents.forEach(student => {
        let row = [
            `<button type="button" class="btn btn-sm btn-light" data-student-id="${student.id}" id="showEducation">+</button>`,
            student.firstName,
            student.lastName,
            student.dateOfBirth,
            student.email,
            student.address,
            student.graduationYear,
            `<button class="btn btn-sm btn-light edit" data-student-id="${student.id}" data-bs-toggle="modal" data-bs-target="#myModal">Edit</button>`,
            `<button class="btn btn-sm btn-light delete" data-student-id="${student.id}">Delete</button>`
        ]
        // re-rendering of table
        table.row.add(row).draw();
    })
}

// Edit button works...
$(document).on('click', '.edit', function () {
    let studentId = $(this).data('student-id');
    editStudent(studentId);
})

function editStudent(id) {
    $('#display_submit').css('display', 'none');
    $('#save').css('display','block');
    
    // find student uniqueId
    let index = arrayOfStudents.findIndex(student => student.id === id);
    // access the element at the specified index
    let student = arrayOfStudents[index];

    $('#fname').val(student.firstName);
    $('#lname').val(student.lastName);
    $('#dob').val(student.dateOfBirth);
    $('#email').val(student.email);
    $('#address').val(student.address);
    $('#graduation-year').val(student.graduationYear);

    // For Education...
    let education = arrayOfStudents[index].education;
    $('#educ-body').empty();
    for (let i = 0; i < education.length; i++) {
        addNewEducationRow();
        $('#educ-body tr:last-child').find('input[name="degreeBoard"]').val(education[i].degreeBoard);
        $('#educ-body tr:last-child').find('input[name="schoolCollage"]').val(education[i].schoolCollage);
        $('#educ-body tr:last-child').find('input[name="startDate"]').val(education[i].startDate);
        $('#educ-body tr:last-child').find('input[name="passoutYear"]').val(education[i].passoutYear);
        $('#educ-body tr:last-child').find('input[name="percentage"]').val(education[i].percentage);
        $('#educ-body tr:last-child').find('input[name="backlog"]').val(education[i].backlog);
    }
    // to track the currently edited student & update student
    currentId = id;
}

// when you click on edit button it's open the pop-up form using so data-bs-target,
// and currentId = id using editStudent(id) , so it's called submit addEventListener by default

function updateStudent() {
    $('#save').on('click', function(){
        let firstName = $('#fname').val();
        let lastName = $('#lname').val();
        let dateOfBirth = $('#dob').val();
        let email = $('#email').val();
        let address = $('#address').val();
        let graduationYear = $('#graduation-year').val();
    
        // find student currentId
        let index = arrayOfStudents.findIndex(student => student.id === currentId);

        arrayOfStudents[index].firstName = firstName;
        arrayOfStudents[index].lastName = lastName;
        arrayOfStudents[index].dateOfBirth = dateOfBirth;
        arrayOfStudents[index].email = email;
        arrayOfStudents[index].address = address;
        arrayOfStudents[index].graduationYear = graduationYear;
        
        // Update education 
        let education = arrayOfStudents[index].education;
        let educationRows = document.querySelectorAll('#educ-body tr');

        for (let i = 0; i < educationRows.length; i++) {
            let degreeBoard = $(educationRows[i]).find('input[name="degreeBoard"]').val();
            let schoolCollage = $(educationRows[i]).find('input[name="schoolCollage"]').val();
            let startDate = $(educationRows[i]).find('input[name="startDate"]').val();
            let passoutYear = $(educationRows[i]).find('input[name="passoutYear"]').val();
            let percentage = $(educationRows[i]).find('input[name="percentage"]').val();
            let backlog = $(educationRows[i]).find('input[name="backlog"]').val();
    
            if (i < education.length) {
                // Update existing education data
                education[i].degreeBoard = degreeBoard;
                education[i].schoolCollage = schoolCollage;
                education[i].startDate = startDate;
                education[i].passoutYear = passoutYear;
                education[i].percentage = percentage;
                education[i].backlog = backlog;
            } else {
                // Add new education data
                education.push({
                    degreeBoard: degreeBoard,
                    schoolCollage: schoolCollage,
                    startDate: startDate,
                    passoutYear: passoutYear,
                    percentage: percentage,
                    backlog: backlog
                });
            }
        }
        displayStudents();
        currentId = null;
    });
}

// add row in education In Student Form
$(document).on('click', '#addNewRowInEducation', function () {
    addNewEducationRow();
})

function addNewEducationRow() {
    let tbody = $('#educ-body');
    let tr = $('<tr></tr>');
    tr.html(`<th><input type="text" name="degreeBoard" class="form-control" placeholder="degree" aria-label="Degree/Board" required></th>
    <td><input type="text" name="schoolCollage" class="form-control" placeholder="Enter Your School/College Name" aria-label="School/College" required></td>
    <td><input type="month" name="startDate" class="form-control" aria-label="Start Date" required></td>
    <td><input type="month" name="passoutYear" class="form-control" aria-label="Passout Year" required></td>
    <td><input type="number" name="percentage" class="form-control" min="0" max="100" placeholder="Do not use % sign" aria-label="Percentage" required></td>
    <td><input type="number" name="backlog" class="form-control" min="0" max="18" placeholder="If any" aria-label="Backlog" required></td>
    <td><input type="button" value="-" id="edu-delete"></td>`)
    tbody.append(tr);
}

// delete row in education In Student Form
$(document).on('click', '#edu-delete', function () {
    deleteEducationData($(this).closest('tr'));
})

function deleteEducationData(row) {
    let index = $(row).closest('tr').index();
    let studentId = currentId;
    let studentIndex = arrayOfStudents.findIndex(student => student.id === studentId);

    // Remove the education data at the specified index
    if (studentIndex !== -1 && index < arrayOfStudents[studentIndex].education.length) {
        // this splice method remove 1 element at index
        arrayOfStudents[studentIndex].education.splice(index, 1);
    }
    deleteEducationRow(row);
}

function deleteEducationRow(row) {
    $(row).closest('tr').remove();
}


// Delete button works...
$(document).on('click', '.delete', function () {
    let studentId = $(this).data('student-id');
    deleteStudent(studentId);
})

function deleteStudent(id) {
    let index = arrayOfStudents.findIndex(student => student.id === id);
    // this splice method remove 1 element at index
    arrayOfStudents.splice(index, 1);
    displayStudents();
}


// For showing nested table
table.on('click','#showEducation',function (){
    let tr = $(this).closest('tr');
    let row = table.row(tr);
    let index = $(this).data('student-id');

    if (row.child.isShown()) {
        row.child.hide();
    }
    else {
        row.child(format(index)).show();
    }
})

// format of data showing (table)
function format(id){
    let index = arrayOfStudents.findIndex(student => student.id === id);
    let education = arrayOfStudents[index].education;

    let nestedTable = $(`<table class="educationTable table table-bordered border-dark text-center">`);
    nestedTable.append(`<thead class="table-light">
    <th class="text-center">Degree/Board</th>
    <th class="text-center">School/College</th>
    <th class="text-center">Start Date</th>
    <th class="text-center">Passout Year</th>
    <th class="text-center">Percentage</th>
    <th class="text-center">Backlog</th>
    </thead>
    <tbody></tbody>`);

    for (let key in education) {
        let row = `<tr><td>` + education[key].degreeBoard + `</td><td>` + education[key].schoolCollage + `</td><td>` + education[key].startDate + `</td><td>` + education[key].passoutYear + `</td><td>` + education[key].percentage + `</td><td>` + education[key].backlog + `</td></tr>`;
        nestedTable.append(row);
    };
    return (nestedTable);
}


// Validation

// Name Validation
$('#fname').on('input', function(){
    if (validateName($('#fname').val())){
        $('#fname').css('border-color','green');
        $('#fname-error').text(" ");
    } else{
        $('#fname').css('border-color','red');
        $('#fname-error').text("please enter valid name(letters only) & not give space");
    }
});
    
$('#lname').on('input',function(){
    if (validateName($('#lname').val())){
        $('#lname').css('border-color','green');
        $('#lname-error').text(" ");
    } else{
        $('#lname').css('border-color','red');
        $('#lname-error').text("please enter valid name(letters only) & not give space");
    }
});
    
function validateName(name){
    const regex = /^[A-Za-z]+$/;
    return regex.test(name);
}

// DOB Validation
$('#dob').on('input',function(){
    if(AgeGreaterThan18()){
        $('#dob').css('border-color','green');
        $('#age-18-error').text(" ");
    } else {
        $('#dob').css('border-color','red');
        $('#age-18-error').text("this form is only for 18 or 18+ aged people");
    }
});

function AgeGreaterThan18(){
    var dates = $('#dob').val().split("-");
    var userYear = dates[0];
    var userMonth = dates[1];
    var userDay = dates[2];
    
    var d = new Date();
    var curYear = d.getFullYear();
    var curMonth = d.getMonth() + 1;
    var curDay = d.getDate();

    var age = curYear - userYear;
    if ( curMonth < userMonth || ((curMonth == userMonth) && (curDay < userDay)) ) {
        age--;
    }
    
    if(age>=18){
        return true
    } else{
        return false
    }
}

// Email Validation
$('#email').on('input',function(){
    if (validateEmail($('#email').val())){
        $('#email').css('border-color','green');
        $('#email-error').text(" ");
    } else {
        $('#email').css('border-color','red');
        $('#email-error').text("please enter valid email address");
    }
});

function validateEmail(email){
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(email);
}