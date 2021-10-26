let appendClonedElement =(parentElement, cloneTargetElement, times)=>  {
    for (let i = 0; i < times; i++) 
        parentElement.appendChild(cloneTargetElement.cloneNode(true));
}

// both

document.getElementById("text-version").addEventListener("click", () => {
    fetch("dummy").then(() => {
        caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
        });
        location.reload();
    }).catch((err) => {
        console.error(err);
    });
});

[...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.addEventListener("click", (event) => {
    if (element.classList.toggle("clicked"))
        [...document.getElementsByClassName("cancelable-button-container")].forEach(element => {
            if (element != event.currentTarget) element.classList.remove("clicked");
        });
}));

[...document.getElementsByClassName("mode-selector-container")].forEach(element => element.addEventListener("click", (event) => {
    element.classList.toggle("mode-file");
    element.classList.toggle("mode-text");
    initialize();
    [...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.classList.remove("clicked"));
}));


// call

appendClonedElement(
    document.getElementById("call-file-label-container"),
    document.getElementsByClassName("call-file-label")[0],
    20,
);

[...document.getElementsByClassName("call-file-input")].forEach(element => element.addEventListener("change", (event) => {
    event.target.parentElement.classList.add("selected");
    event.target.parentElement.getElementsByClassName("call-file-text")[0].innerText = event.target.files[0].name;
}));

document.getElementById("call-button-tuning").addEventListener("click", () => {
    initialize();
    call_callOneRound(new Uint8Array(BytesPerRound).fill(0xCC), 3600000);
});

document.getElementById("call-button-tuning-cancel").addEventListener("click", () => {
    initialize();
});

document.getElementById("call-button-send").addEventListener("click", () => {
    if (document.getElementById("call-mode-selector-container").classList.contains("mode-text"))
        call_callString(document.getElementById("call-textarea").value, speed);
    else 
        call_callFile(document.getElementsByClassName("call-file-input")[0].files[0], 0, speed);
});

document.getElementById("call-button-send-cancel").addEventListener("click", () => {
    initialize();
});


// listen

appendClonedElement(
    document.getElementById("listen-file-downloader-container"),
    document.getElementsByClassName("listen-file-downloader")[0],
    20,
);

[...document.getElementsByClassName("listen-file-downloader")].forEach(element => {
    element.addEventListener("click", (event) => {
        !event.target.classList.contains("exist") || 
        event.target.classList.contains("verified") || 
        confirm("整合性の保証が無効です。ファイルが破損している可能性がありますが、このまま開きますか？") ||
        event.preventDefault()
    })
})

document.getElementsByClassName("threshold-range")[0].addEventListener("change", (event) => {
    threshold = threshold.map(threshold => threshold + (event.target.value - thresholdAve))
    thresholdAve = event.target.value;
    event.stopPropagation();
});

document.getElementById("listen-button-tuning").addEventListener("click", () => {
    setTimeout(listen_tuning, 150);
});

document.getElementById("listen-button-receive").addEventListener("click", (event) => {
    if (document.getElementById("listen-mode-selector-container").classList.contains("mode-text")) 
        listen_startListenStringLoop();
    else
        listen_startListenFileLoop();
});

document.getElementById("listen-button-receive-cancel").addEventListener("click", (event) => {
    initialize();
});


// call visualiser

appendClonedElement(
    document.getElementById("call-visualiser-container"),
    document.getElementsByClassName("call-visualiser-byte-container")[0],
    BytesPerRound - 1
);

// listen visualiser

appendClonedElement(
    document.getElementById("listen-visualiser-container"),
    document.getElementsByClassName("listen-visualiser-byte-container")[0],
    BytesPerRound - 1
);

// visualiser

Frequencies.forEach((frequency, index) => {
    CallVisualiserParent.children[Math.trunc(index / 8)].children[index % 8].innerText = Math.trunc(frequency);
    ListenVisualiserParent.children[Math.trunc(index / 8)].children[index % 8].innerText = Math.trunc(frequency);
})

// scroll manager

document.getElementById("window-startup").scrollIntoView();

document.getElementById("startup-call-container").addEventListener("click", () => {
    document.getElementById("window-call").scrollIntoView({behavior: "smooth"});
});

document.getElementById("startup-listen-container").addEventListener("click", () => {
    document.getElementById("window-listen").scrollIntoView({behavior: "smooth"});
});

document.getElementById("container").addEventListener("scroll", () => {
    let boundingClientRects = {
        call: document.getElementById("window-call-visualiser").getBoundingClientRect(),
        listen: document.getElementById("window-listen-visualiser").getBoundingClientRect()
    }
    visualise = boundingClientRects.call.left > -boundingClientRects.call.width * 0.95 || boundingClientRects.listen.left < boundingClientRects.listen.width * 0.95;
})

let windowOrderArray = [...document.getElementById("container").children].map(element => element.id);

[...document.getElementsByClassName("interwindow-arrow")].forEach(element => {
    element.addEventListener("click", (event) => {
        let scrollIntoViewTarget = windowOrderArray[windowOrderArray.indexOf(event.target.parentElement.id) + (event.target.classList.contains("interwindow-arrow-right") ? 1 : -1)];
        document.getElementById(scrollIntoViewTarget).scrollIntoView({behavior: "smooth"});
    });
})

// localStorage