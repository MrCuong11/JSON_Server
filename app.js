var API = 'http://localhost:3000/Course';

function start() {
    getCourses(function (course) {
        renderCourse(course);
    });
    handleCreateForm()
}



start();


//function 
function getCourses(callback) {
    fetch(API)
        .then((response) => {
            return response.json();
        })
        .then(callback)
}

function createCourses(data, callback) {
    var option = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(API, option)
        .then((response) => {
            response.json();
        })
        .then(callback)
}

function renderCourse(courses) {
    var listCourses = document.querySelector('#list-courses');
    var html = courses.map(function (course) {
        return `<li class="course-item-${course.id}">
            <h4>${course.name}</h4>
            <p>${course.desc}</p>
            <button onclick="UpdateCourse(${course.id})">Update</button>
            <button onclick="DeleteCourse(${course.id})">Delete</button>
        </li>`
    })
    listCourses.innerHTML = html.join('');
}



function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function () {
        var name = document.querySelector('input[name="name"]').value;
        var desc = document.querySelector('input[name="desc"]').value;
        var formData = {
            name: name,
            desc: desc
        }
        createCourses(formData, function () {
            getCourses(function (course) {
                renderCourse(course);
            });
        })
    }
}


function DeleteCourse(id) {
    var option = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(API + "/" + id, option)
        .then((response) => {
            response.json();
        })
        .then(function () {
            document.querySelector(`.course-item-` + id).remove();
        })
}


function UpdateCourse(id) {
    var courseItem = document.querySelector(".course-item-" + id);

    if (courseItem) {
        var courseNameElement = courseItem.querySelector("h4");
        var courseDescriptionElement = courseItem.querySelector("p");

        var courseName = courseNameElement.textContent;
        var courseDescription = courseDescriptionElement.textContent;

        var htmls = `
            <h4>${courseName}</h4>
            <div>
                <div>
                    <label for="nameupdate">Name</label>
                    <input type="text" id="nameupdate" name="nameupdate" value="${courseName}" />
                </div>
                <div>
                    <label for="descriptionupdate">Description</label>
                    <input type="text" id="descriptionupdate" name="descriptionupdate" value="${courseDescription}" />
                </div>
                <div>
                    <button id="save">Save</button>
                    <button id="cancel">Cancel</button>
                </div>
            </div>
        `;

        courseItem.innerHTML = htmls;

        var courseUpdate = document.querySelector("#save");
        courseUpdate.addEventListener("click", function () {
            var name = document.querySelector('input[name="nameupdate"]').value;
            var description = document.querySelector('input[name="descriptionupdate"]').value;

            var options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    desc: description,
                }),
            };

            fetch(API + "/" + id, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function () {
                    // Sau khi cập nhật, hiển thị lại danh sách khóa học
                    getCourses(function (course) {
                        renderCourse(course);
                    });
                });
        });

        var courseCancel = document.querySelector("#cancel");
        courseCancel.addEventListener("click", function () {
            // Khi hủy bỏ chỉnh sửa, hiển thị lại thông tin khóa học ban đầu
            getCourses(function (course) {
                renderCourse(course);
            });
        });
    }
}

