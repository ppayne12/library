let nextId = 0;
let editing = false;

/*myLibrary.push(new Book("Lord of the Rings", "Tolken", 500, true));
myLibrary.push(new Book("Olivia", "Unknown", 200, true));
myLibrary.push(new Book("Olivia", "Unknown", 200, false));
myLibrary.push(new Book("Lord of the Rings", "Tolken", 500, true));
myLibrary.push(new Book("Olivia", "Unknown", 200, true, "Claire"));
myLibrary.push(new Book("Olivia", "Unknown", 200, true));
myLibrary.push(new Book("Lord of the Rings", "Tolken", 500, true));
myLibrary.push(new Book("Olivia", "Unknown", 200, true));
myLibrary.push(new Book("Olivia", "Unknown", 200, true));
*/

var firebaseConfig = {
    apiKey: "AIzaSyBM6ryXUBz1vt3UErfmNAuw4sX4IR2Lj1g",
    authDomain: "library-165d6.firebaseapp.com",
    databaseURL: "https://library-165d6.firebaseio.com",
    projectId: "library-165d6",
    storageBucket: "library-165d6.appspot.com",
    messagingSenderId: "424814407849",
    appId: "1:424814407849:web:1328acae0b14ddc4fc79b8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const addIcon = document.querySelector('.plus');
addIcon.addEventListener('click', (e) => editing ? save(e) : add(e));
document.addEventListener('keyup', e => {
    if (event.keyCode === 13) {
        editing ? save(e) : console.log("nothing to save");
    }
})

firebase.database().ref('/nextid/').once('value').then(snap => {
    nextId = snap.val().id;
});
render();

function Book(title, author, numPages, readFlag, lent) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.read = readFlag;
    this.lent = lent;
    this.id = nextId;
    nextId++;
    this.info = function () {
        return `${this.title} by ${this.author}, ${this.numPages} pages, ${this.read ? "has been read" : "not read yet"}`
    }
}

function render() {
    const table = document.querySelector("#books");
    table.innerHTML = `<tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th style="width: 90px;">Pages</th>
                            <th style="width: 90px;">Read?</th>
                            <th>Lent Out?</th>
                        </tr>`;

    firebase.database().ref('/books/').once('value').then(snap => {
        let books = snap.val();
        if (books) {
            books.forEach(element => {
                let tr = document.createElement('tr');
                tr.setAttribute('id', element.id);
                tr.innerHTML = `<td>${element.title}</td><td>${element.author}</td><td>${element.numPages}</td><td>${element.read ? 'Yes' : 'No'}</td><td>${element.lent ? element.lent : ''}</td><td class="editicons"> <input type="image" class="edit" id="${element.id}" width=20px height=20px src="img/pencil.svg" /></td>`;
                table.appendChild(tr);

            });
        }
        updateEventListeners();
    });





}

function add(e) {
    const table = document.querySelector("#books");
    const tr = document.createElement('tr');
    tr.setAttribute('id', nextId);
    tr.classList.add('active');
    tr.innerHTML = `<td><input type="text" value=""></td><td><input type="text" value=""></td><td><input type="text" style="width:80px" value=""></td><td><input type="checkbox" style="width:80px" value=""></td><td><input type="text" value=""></td><td class="editicons"> <input type="image" class="edit" id="${nextId}" width=20px height=20px src="img/pencil.svg" /></td>`;
    table.appendChild(tr);
    editing = true;
}

function edit(e) {
    const tr = document.getElementById(e.currentTarget.id);
    tr.classList.add('active');
    const trNodes = tr.childNodes;
    for (let i = 0; i < trNodes.length - 1; i++) {
        let input;
        if (i === 2) {
            input = `<input type="text" style="width:80px" value="${trNodes[i].textContent}">`
        } else if (i === 3) {
            input = `<input type="checkbox" style="width:80px" ${trNodes[i].textContent === "Yes" ? "checked" : ""}>`
        } else {
            input = `<input type="text" value="${trNodes[i].textContent}">`
        }
        trNodes[i].innerHTML = input;
    }
    editing = true;
}

function save(e) {
    const tr = document.querySelector(".active")
    const trNodes = tr.childNodes;
    let title = trNodes[0].firstChild.value;
    let author = trNodes[1].firstChild.value;
    let pages = +trNodes[2].firstChild.value;
    let read = trNodes[3].firstChild.checked;
    let lent = trNodes[4].firstChild.value;
    if (+tr.id === nextId) {
        writeBook(new Book(title, author, pages, read, lent));
    } else {
        updateBook(+tr.id, title, author, pages, read, lent);
    }
    tr.classList.remove("active")
    render();
    editing = false;
}

function updateEventListeners() {
    const editIcons = document.querySelectorAll('.edit');

    editIcons.forEach(button => {
        button.addEventListener('click', (e) => editing ? save(e) : edit(e));
    });

}

function writeBook(book) {
    let title = book.title ? book.title : '';
    let author = book.author ? book.author : '';
    let numPages = book.numPages ? +book.numPages : '';
    let readFlag = book.read ? book.read : false;
    let lent = book.lent ? book.lent : '';

    firebase.database().ref('books/' + book.id).set({
        id: book.id,
        title: title,
        author: author,
        numPages: numPages,
        read: readFlag,
        lent: lent

    });

    return firebase.database().ref('nextid/').set({ id: nextId });
}

function updateBook(id, title, author, numPages, readFlag, lent) {
    let updates = {};
    updates['/books/' + id] = {
        id: id,
        title: title ? title : '',
        author: author ? author : '',
        numPages: numPages ? numPages : '',
        read: readFlag ? readFlag : false,
        lent: lent ? lent : ''
    }

    return firebase.database().ref().update(updates);
}

function getBooks() {


}

