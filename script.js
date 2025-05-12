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
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let facingMode = "user"; // Default to front camera
let videoElem;
let cameraContainer;
let openCameraBtn;
let closeCameraBtn;
let switchCameraBtn;
let takePhotoBtn;
let startRecordingBtn;
let stopRecordingBtn;

photoAlbumButton.addEventListener('click', () => {
    photoModal.classList.remove('hidden');
});

photoCloseButton.addEventListener('click', () => {
    photoModal.classList.add('hidden');
    stopCamera();
});

// Initialize camera elements after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    videoElem = document.getElementById('camera-preview');
    cameraContainer = document.getElementById('camera-container');
    openCameraBtn = document.getElementById('open-camera-btn');
    closeCameraBtn = document.getElementById('close-camera-btn');
    switchCameraBtn = document.getElementById('switch-camera-btn');
    takePhotoBtn = document.getElementById('take-photo-btn');
    startRecordingBtn = document.getElementById('start-recording-btn');
    stopRecordingBtn = document.getElementById('stop-recording-btn');
    
    openCameraBtn.addEventListener('click', startCamera);
    closeCameraBtn.addEventListener('click', stopCamera);
    switchCameraBtn.addEventListener('click', switchCamera);
    takePhotoBtn.addEventListener('click', takePhoto);
    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);
});

// Function to start the camera
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: facingMode
            },
            audio: false
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElem.srcObject = mediaStream;
        
        cameraContainer.classList.remove('hidden');
        openCameraBtn.classList.add('hidden');
        closeCameraBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Could not access the camera. Please make sure you have granted camera permissions.");
    }
}

// Function to stop the camera
function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
        videoElem.srcObject = null;
    }
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    cameraContainer.classList.add('hidden');
    openCameraBtn.classList.remove('hidden');
    closeCameraBtn.classList.add('hidden');
    stopRecordingBtn.classList.add('hidden');
    startRecordingBtn.classList.remove('hidden');
    
    // Remove recording indicator if it exists
    const indicator = document.querySelector('.recording-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Function to switch between front and back cameras
function switchCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    stopCamera();
    startCamera();
}

// Function to take a photo
function takePhoto() {
    if (!mediaStream) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;
    
    // Draw the current video frame onto the canvas
    context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Create photo element and add to grid
    addPhotoToGrid(imageDataUrl, 'camera-photo.png');
}

// Function to start video recording
function startRecording() {
    if (!mediaStream) return;
    
    recordedChunks = [];
    
    // Create a recorder with the stream
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
        mediaRecorder = new MediaRecorder(mediaStream, options);
    } catch (e) {
        console.error('MediaRecorder is not supported by this browser.');
        return;
    }
    
    // Event handlers
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = () => {
        // Create a blob from recorded chunks
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        
        // Create URL for the blob
        const videoUrl = URL.createObjectURL(blob);
        
        // Create a video element and add to grid
        const videoDiv = document.createElement('div');
        videoDiv.className = 'photo-item';
        
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
        
        videoDiv.appendChild(videoElement);
        photoGrid.appendChild(videoDiv);
        
        // Save video data
        const reader = new FileReader();
        reader.onload = (e) => {
            photos.push({
                name: `recording-${new Date().toISOString()}.webm`,
                data: e.target.result,
                type: 'video'
            });
        };
        reader.readAsDataURL(blob);
    };
    
    // Start recording
    mediaRecorder.start(100);
    
    // Add recording indicator
    const indicator = document.createElement('div');
    indicator.className = 'recording-indicator';
    cameraContainer.appendChild(indicator);
    
    // Update UI
    startRecordingBtn.classList.add('hidden');
    stopRecordingBtn.classList.remove('hidden');
}

// Function to stop video recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        // Remove recording indicator
        const indicator = document.querySelector('.recording-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        // Update UI
        startRecordingBtn.classList.remove('hidden');
        stopRecordingBtn.classList.add('hidden');
    }
}

// Helper function to add a photo to the grid
function addPhotoToGrid(src, name) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-item';
    
    const img = document.createElement('img');
    img.src = src;
    
    photoDiv.appendChild(img);
    photoGrid.appendChild(photoDiv);
    
    photos.push({
        name: name,
        data: src,
        type: 'image'
    });
}

// Handle file uploads from photo input
photoInput.addEventListener('change', (e) => {
    const files = e.target.files;
    
    for(let file of files) {
        if(file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                addPhotoToGrid(e.target.result, file.name);
            };
            
            reader.readAsDataURL(file);
        }
    }
});

// Close the photo modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if(e.target === photoModal) {
        photoModal.classList.add('hidden');
        stopCamera();
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
