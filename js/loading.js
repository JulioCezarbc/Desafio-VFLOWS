function showLoading() {
    const div = document.createElement("div");
    div.classList.add("loading", "centralize");

    const loaderCircle = document.createElement("div");
    loaderCircle.classList.add("loader-circle");

    div.appendChild(loaderCircle);

    document.body.appendChild(div);
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading");

    if (loadings.length) {
        loadings[0].remove();
    }
}