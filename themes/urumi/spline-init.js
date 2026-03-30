
document.addEventListener("DOMContentLoaded", function() {
    // Wait for spline-viewer to be defined
    if (customElements.get("spline-viewer")) {
        initSplineViewer();
    } else {
        customElements.whenDefined("spline-viewer").then(() => {
            initSplineViewer();
        });
    }
});

function initSplineViewer() {
    const splineViewer = document.querySelector("spline-viewer");
    if (splineViewer) {
        console.log("Spline viewer found and should be loading...");
        // Force visibility
        splineViewer.style.position = "absolute";
        splineViewer.style.top = "0";
        splineViewer.style.left = "0";
        splineViewer.style.width = "100%";
        splineViewer.style.height = "100%";
        splineViewer.style.zIndex = "1";
        splineViewer.style.display = "block";
    } else {
        console.error("Spline viewer element not found");
    }
}
