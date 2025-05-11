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
const photoAlbumButton = document.getElementById('photoAlbumButton');
const photoModal = document.getElementById('photo-modal');
const photoCloseButton = document.getElementById('photoCloseButton');
const photoInput = document.getElementById('photoInput');
const photoGrid = document.getElementById('photoGrid');

//photos album
let photos = [];

photoAlbumButton.addEventListener('click', () => {
    photoModal.classList.remove('hidden');
});

photoCloseButton.addEventListener('click', () => {
    photoModal.classList.add('hidden');
});

photoInput.addEventListener('change', (e) => {
    const files = e.target.files;
    
    for(let file of files) {
        if(file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                photoDiv.appendChild(img);
                photoGrid.appendChild(photoDiv);
                
                photos.push({
                    name: file.name,
                    data: e.target.result
                });
            };
            
            reader.readAsDataURL(file);
        }
    }
});

// Close the photo modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if(e.target === photoModal) {
        photoModal.classList.add('hidden');
    }
});

// Close the photo modal when clicking the close button
const isExistsCheck = (name) => {
  console.log(fileSystem);

  return fileSystem.currentFolder.children.hasOwnProperty(name);
};

const ele = {
  modalType: null,
};

// createFolder
const createFolder = (name) => {
  if (isExistsCheck(name)) {
    return {
      status: false,
      message: "Folder already exists",
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
    message: "Folder created successfully",
  };
  
  
}
// Move event listeners outside of openModal function
closeModalButton.addEventListener("click", () => {
  closeModal();
});

createModalButton.addEventListener("click", () => {
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

const openModal = (modalType) => {
  console.log(modalType);
  modal.classList.toggle("hidden");
  modalType === "folder"
    ? (ele.modalType = "folder")
    : (ele.modalType = "file");
  modalHeading.innerText =
    ele.modalType === "folder" ? "Create a new folder" : "Create a new file";
  nameInput.focus();
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
const navigate = (name) => {
    console.log(name, "name from navigator");
    // Clear current display area
    displayArea.innerHTML = '';
    
    // Update current folder
    fileSystem.currentFolder = fileSystem.currentFolder.children[name];
    
    // Add back button if not in root
    if (fileSystem.currentFolder.parent !== null) {
        const backDiv = document.createElement("div");
        backDiv.innerHTML = `
            <div class="card">
                <h1>⬅️</h1>
                <p>Back</p>
            </div>
        `;
        backDiv.addEventListener("click", () => {
            displayArea.innerHTML = '';
            fileSystem.currentFolder = fileSystem.currentFolder.parent;
            // Display parent folder contents
            Object.keys(fileSystem.currentFolder.children).forEach(childName => {
                displayItemsOnscreen(childName);
            });
        });
        displayArea.appendChild(backDiv);
    }
    
    // Display folder contents
    Object.keys(fileSystem.currentFolder.children).forEach(childName => {
        displayItemsOnscreen(childName);
    });
}
const openEditor = (name) => {
    editorModal.classList.remove("hidden");
    fileSystem.currentFile = fileSystem.currentFolder.children[name];
    textEditor.value = fileSystem.currentFile.content;
    document.getElementById("textAreaHeading").textContent = `Editing: ${name}`;
}

editorSaveButton.addEventListener("click", () => {
    if (fileSystem.currentFile) {
        fileSystem.currentFile.content = textEditor.value;
        editorModal.classList.add("hidden");
        // Optional: Show save confirmation
        alert("File saved successfully!");
    }
});


editorCloseButton.addEventListener("click", ()=>{
  console.log("close editor clicked");
  
  editorModal.classList.add("hidden")
})

// delete File

// delete folder

// update file

// save

// System Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('systemClock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// Add initialization for fileSystem
fileSystem.currentFolder = fileSystem.root;
fileSystem.currentPath = "/";

// Add createFile function that was missing
const createFile = (name) => {
  if (isExistsCheck(name)) {
    return {
      status: false,
      message: "File already exists",
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
    message: "File created successfully",
  };
};

// Add editor close functionality
editorCloseButton.addEventListener("click", () => {
  editorModal.classList.add("hidden");
});
