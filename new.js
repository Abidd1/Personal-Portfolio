// Abid Ali javascript enw file for downlaod pdf button 



document.getElementById('downloadBtn').addEventListener('click', function() {
    // Path to the CV file
    const fileUrl = './' // Replace with the actual path to your CV file

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = "https://drive.google.com/file/d/1IvkI7Tjxlu9qlGvvdVaODE2YdPJ72FnD/view?usp=drive_link"; // The name of the downloaded file

    // Append the anchor to the body (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click(https://drive.google.com/file/d/1IvkI7Tjxlu9qlGvvdVaODE2YdPJ72FnD/view?usp=drive_link);

    // Remove the anchor from the document
    document.body.removeChild(link);
});