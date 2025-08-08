// DOM elements are only available in the browser environment.
// When running tests in Node, these will remain undefined and can be
// mocked as needed.
let video, canvas, ctx, captureBtn, changeGlassesBtn, capturedImages;
if (typeof document !== 'undefined') {
    video = document.getElementById('video');
    canvas = document.getElementById('overlay');
    ctx = canvas.getContext('2d');
    captureBtn = document.getElementById('captureBtn');
    changeGlassesBtn = document.getElementById('changeGlassesBtn');
    capturedImages = document.getElementById('capturedImages');
}

// Array of glasses options
const glassesOptions = [
    'glasses/glasses.png',
    'glasses/1.png',   
    'glasses/2.png',
    'glasses/3.png',
    'glasses/4.png',
    'glasses/pngwing.com (5).png',
    'glasses/pngwing.com (6).png',
    'glasses/pngwing.com (7).png',
    'glasses/pngwing.com (8).png',

];
let currentGlassesIndex = 0;
let currentGlassesImg = null; // Track the current glasses image

// Load models and start the video only when running in the browser
if (typeof document !== 'undefined') {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('models')
    ]).then(startVideo);
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('play', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                loadGlasses();
                // Start the animation loop once
                requestAnimationFrame(detectFaceAndDraw);
            });
        })
        .catch(err => console.error("Error accessing the webcam: ", err));
}

function loadGlasses() {
    const glassesImg = new Image();
    glassesImg.src = glassesOptions[currentGlassesIndex];
    
    // Only reset drawing when the new image is loaded
    glassesImg.onload = () => {
        currentGlassesImg = glassesImg; // Update current glasses
    };
}

function getCenterOfPoints(points) {
    const sum = points.reduce((acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
    }, { x: 0, y: 0 });
    return {
        x: sum.x / points.length,
        y: sum.y / points.length
    };
}

function drawFrame(glassesImg, eyeCenterX, eyeCenterY, glassesWidth, glassesHeight, angle) {
    // ctx and canvas may be mocked in tests. Guard against undefined.
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Only draw if we have valid positions and a glasses image
    // Using explicit nullish checks so coordinates at 0 don't skip drawing
    if (ctx && glassesImg && eyeCenterX != null && eyeCenterY != null && glassesWidth && glassesHeight) {
        ctx.save();
        ctx.translate(eyeCenterX, eyeCenterY);
        ctx.rotate(angle || 0);
        ctx.drawImage(
            glassesImg,
            -glassesWidth / 2,
            -glassesHeight / 2,
            glassesWidth,
            glassesHeight
        );
        ctx.restore();
    }
}

function detectFaceAndDraw() {
    // Only proceed if we have a glasses image loaded
    if (!currentGlassesImg) {
        requestAnimationFrame(detectFaceAndDraw);
        return;
    }
    
    faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .then(result => {
            let detectionData = {};
            if (result) {
                const landmarks = result.landmarks;
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();
                const leftEyeCenter = getCenterOfPoints(leftEye);
                const rightEyeCenter = getCenterOfPoints(rightEye);
                const dx = rightEyeCenter.x - leftEyeCenter.x;
                const dy = rightEyeCenter.y - leftEyeCenter.y;
                const angle = Math.atan2(dy, dx);
                detectionData.eyeCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
                detectionData.eyeCenterY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
                detectionData.angle = angle;
                detectionData.glassesWidth = Math.hypot(dx, dy) * 2.5; // Made glasses slightly bigger
                const aspectRatio = currentGlassesImg.naturalHeight / currentGlassesImg.naturalWidth;
                detectionData.glassesHeight = detectionData.glassesWidth * aspectRatio;
                
                // Draw the frame with the current detection data
                drawFrame(
                    currentGlassesImg,
                    detectionData.eyeCenterX,
                    detectionData.eyeCenterY, 
                    detectionData.glassesWidth,
                    detectionData.glassesHeight, 
                    detectionData.angle
                );
            }
            
            // Continue the animation loop
            requestAnimationFrame(detectFaceAndDraw);
        })
        .catch(err => {
            console.error("Detection error:", err);
            // Continue the animation loop even if there's an error
            requestAnimationFrame(detectFaceAndDraw);
        });
}

// Capture current frame only if running in the browser
if (typeof document !== 'undefined' && captureBtn) {
captureBtn.addEventListener('click', () => {
    // Create a new canvas to capture the combined video and overlay
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const captureCtx = captureCanvas.getContext('2d');
    
    // Draw the video first
    captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    // Then draw the canvas overlay with glasses
    captureCtx.drawImage(canvas, 0, 0, captureCanvas.width, captureCanvas.height);
    
    // Create a container for the captured image with neobrutalism style
    const imageContainer = document.createElement('div');
    imageContainer.className = 'relative neo-border bg-white p-2 neo-shadow';
    
    // Create image element and set its source to the canvas data
    const img = document.createElement('img');
    img.src = captureCanvas.toDataURL('image/png');
    img.className = 'w-full';
    imageContainer.appendChild(img);
    
    // Add a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'absolute -top-3 -right-3 bg-neo-pink neo-border w-8 h-8 flex items-center justify-center font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all';
    deleteBtn.addEventListener('click', () => {
        imageContainer.remove();
    });
    imageContainer.appendChild(deleteBtn);
    
    // Add the captured image to the gallery
    capturedImages.prepend(imageContainer);
    
    // Add animation effect
    imageContainer.style.transform = 'scale(0.8)';
    imageContainer.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        imageContainer.style.transform = 'scale(1)';
    }, 50);
});
}

// Change glasses style
if (typeof document !== 'undefined' && changeGlassesBtn) {
changeGlassesBtn.addEventListener('click', () => {
    currentGlassesIndex = (currentGlassesIndex + 1) % glassesOptions.length;
    loadGlasses();

    // Add animation to button
    changeGlassesBtn.classList.add('translate-x-1', 'translate-y-1', 'shadow-none');
    setTimeout(() => {
        changeGlassesBtn.classList.remove('translate-x-1', 'translate-y-1', 'shadow-none');
    }, 200);
});
}

// Export functions for testing in Node environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCenterOfPoints, drawFrame };
}