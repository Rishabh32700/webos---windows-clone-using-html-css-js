const fileSystem = {
  root: {
    type: "folder",
    name: "Home",
    children: {},
    parent: null,
  },
  currentPath: null,
  currentFolder: null,
  currentFile: null,
};

const nameInput = document.getElementById("nameInput");

const createFolderButton = document.getElementById("createFolderButton");
const createFileButton = document.getElementById("createFileButton");

const createModalButton = document.getElementById("createModalButton");

const modal = document.getElementById("modal");

const modalHeading = document.getElementById("modalHeading");
const closeModalButton = document.getElementById("closeModalButton");
const displayArea = document.getElementById("displayArea");

const editorModal = document.getElementById("editorModal");
const textEditor = document.getElementById("textEditor");
const editorSaveButton = document.getElementById("editorSaveButton");
const editorCloseButton = document.getElementById("editorCloseButton");

// ------------------EXTRA PART (pop menu or context menu )-----------------------
const contextMenu = document.getElementById("contextMenu");
const contextCreateFile = document.getElementById("contextCreateFile");
const contextCreateFolder = document.getElementById("contextCreateFolder");


// ------------------ Extra part end ------------

// Initialize current folder to root on page load
(() => {
  fileSystem.currentFolder = fileSystem.root;
})();

const ele = {
  modalType: null,
};

// Check if name exists in current folder children
const isExistsCheck = (name) => {
  return fileSystem.currentFolder.children.hasOwnProperty(name);
};

// Create folder function
const createFolder = (name) => {
  modalHeading.innerText = "Create a new folder";

  if (isExistsCheck(name)) {
    return { status: false, message: `${name} already exists` };
  }

  fileSystem.currentFolder.children[name] = {
    type: "folder",
    name,
    children: {},
    parent: fileSystem.currentFolder,
  };

  return { status: true, message: `${name} folder created successfully`, item: fileSystem.currentFolder.children[name] };
};

// Create file function
const createFile = (name) => {
  modalHeading.innerText = "Create a new file";

  if (isExistsCheck(name)) {
    return { status: false, message: `${name} already exists` };
  }

  fileSystem.currentFolder.children[name] = {
    type: "file",
    name,
    content: "",
    parent: fileSystem.currentFolder,
  };

  return { status: true, message: `${name} file created successfully`, item: fileSystem.currentFolder.children[name] };
};

// Open modal function: just shows modal and sets type
const openModal = (modalType) => {
  modal.classList.remove("hidden"); // show modal
  ele.modalType = modalType;
  modalHeading.innerText = modalType === "Folder" ? "Create a new Folder" : "Create a new File";
  nameInput.value = "";  // clear input when opening modal
  nameInput.focus();
};

// Close modal function
const closeModal = () => {
  modal.classList.add("hidden"); // hide modal
  nameInput.value = "";
};

// Display created folder/file on screen
const displayItemsOnscreen = (name) => {
  const div = document.createElement("div");

  const icon = ele.modalType === "Folder" ? "📂" : "📄";
  const subName = name;

  div.innerHTML = `
    <div class="card">
      <h1>${icon}</h1>
      <p>${subName}</p>
    </div>
  `;

  div.id = name;

  displayArea.appendChild(div);

  div.addEventListener("dblclick", () => {
    const item = fileSystem.currentFolder.children[subName];
    if (!item) return;  // just in case
  
    if (item.type === "folder") {
      navigate(subName);
    } else if (item.type === "file") {
      openEditor(subName);
    }
  });
  
};

// Navigate function (folder open)
const navigate = (name) => {
  console.log("Navigate to folder:", name);
  // You can add your folder navigation logic here
};

// Open editor modal for files
const openEditor = (name) => {
  editorModal.classList.remove("hidden");

  fileSystem.currentFile = fileSystem.currentFolder.children[name];

  textEditor.value = fileSystem.currentFile.content;
};

// Event listeners for editor modal buttons
editorSaveButton.addEventListener("click", () => {
  if (fileSystem.currentFile) {
    fileSystem.currentFile.content = textEditor.value;
    editorModal.classList.add("hidden");
  }
});

editorCloseButton.addEventListener("click", () => {
  editorModal.classList.add("hidden");
});

// Event listeners for modal open buttons
createFolderButton.addEventListener("click", () => {
  openModal("Folder");
});

createFileButton.addEventListener("click", () => {
  openModal("File");
});

// **IMPORTANT: Add event listeners for modal buttons ONCE here, NOT inside openModal**
closeModalButton.addEventListener("click", () => {
  closeModal();
});

createModalButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return;

  const returnVal = ele.modalType === "Folder" ? createFolder(name) : createFile(name);

  if (returnVal.status) {
    displayItemsOnscreen(name);
  } else {
    alert(returnVal.message);
  }

  closeModal();
});

// -----------------EXTRA PART (pop menu or context menu).--------------------

// Show context menu on right-click
displayArea.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.style.left = `${e.pageX}px`;
  contextMenu.classList.remove("hidden");
});

// Hide context menu when clicking elsewhere
document.addEventListener("click", () => {
  contextMenu.classList.add("hidden");
});

// Create file/folder from context menu
contextCreateFile.addEventListener("click", () => {
  openModal("File");
});

contextCreateFolder.addEventListener("click", () => {
  openModal("Folder");
});