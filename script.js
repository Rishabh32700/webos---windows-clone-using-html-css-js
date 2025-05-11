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
const textEditor = document.getElementById("textEditor");
const editorSaveButton = document.getElementById("editorSaveButton");
const editorCloseButton = document.getElementById("editorCloseButton");
const editorModal = document.getElementById("editor-modal");


// initFileSystem
(() => {
  console.log("iife");
  fileSystem.currentFolder = fileSystem.root;
})();

// createFolder
const createFolder = (name) => {
  console.log("folder created");
  modalHeading.innerText = "create a new Folder";

  if (isExistsCheck(name)) {
    return {
      status: false,
      mesage: `${name} already exists`,
    };
  }

  fileSystem.currentFolder.children[name] = {
    type: "folder",
    name: name,
    children: {},
    parent: fileSystem.currentFolder,
  };

  return {
    status: true,
    mesage: `${name} folder created successfully`,
    item: fileSystem.currentFolder.children[name],
  };
};

// createFile
const createFile = (name) => {
  console.log("file created");

  modalHeading.innerText = "create a new File";

  if (isExistsCheck(name)) {
    return {
      status: false,
      mesage: `${name} already exists`,
    };
  }

  fileSystem.currentFolder.children[name] = {
    type: "file",
    name: name,
    content: "",
    parent: fileSystem.currentFolder,
  };

  return {
    status: true,
    mesage: `${name} file created successfully`,
    item: fileSystem.currentFolder.children[name],
  };
};

// isExistsCheck
const isExistsCheck = (name) => {
  console.log(fileSystem);

  return fileSystem.currentFolder.children.hasOwnProperty(name);
};

const ele = {
  modalType: null,
};

// openModal
const openModal = (modalType) => {
  console.log(modalType);
  modal.classList.toggle("hidden");
  modalType === "folder"
    ? (ele.modalType = "folder")
    : (ele.modalType = "file");
  modalHeading.innerText =
    ele.modalType === "folder" ? "Create a new folder" : "Create a new file";
  nameInput.focus();
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });

  createModalButton.addEventListener("click", () => {
    console.log(ele.modalType);

    const name = nameInput.value.trim();
    if (name) {
      const returnVal =
        ele.modalType === "folder" ? createFolder(name) : createFile(name);
      console.log(returnVal);
      if (returnVal.status) {
        displayItemsOnscreen(name);
      }
      closeModal();
    }
  });
};

// closeModal
const closeModal = (modalType) => {
  console.log(modalType);
  modal.classList.toggle("hidden");
  nameInput.value = "";
};

createFolderButton.addEventListener("click", () => {
  openModal("folder");
});

createFileButton.addEventListener("click", () => {
  openModal("file");
});

// displayItemsOnscreen

const displayItemsOnscreen = (name) => {
  const div = document.createElement("div");
  console.log(ele, "ele");

  const icon = ele.modalType === "folder" ? "📁" : "📄";
  const subName = name;
  div.innerHTML = `
    <div class="card">
        <h1>${icon}</h1>
        <p>${subName}</p>
    </div>
    `;

  div.id = name;
  displayArea.appendChild(div);
  div.addEventListener("dblclick",()=>{
    console.log("dblclick");
    ele.modalType === "folder" ? navigate(subName) : openEditor(subName)
    
  })

};


// openFolder
const navigate  = (name) =>{
    console.log(name, "name from navigator");
    
}
const openEditor  = (name) =>{
    editorModal.classList.remove("hidden")
    fileSystem.currentFile = fileSystem.currentFolder.children[name]
    textEditor.value = fileSystem.currentFile.content
}

editorSaveButton.addEventListener("click", ()=>{
    if(fileSystem.currentFile){
      fileSystem.currentFile.content = textEditor.value
      editorModal.classList.add("hidden")
    }
})


editorCloseButton.addEventListener("click", ()=>{
  console.log("close editor clicked");
  
  editorModal.classList.add("hidden")
})

// delete File

// delete folder

// update file

// save
