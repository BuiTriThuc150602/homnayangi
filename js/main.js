let duration = 5;
let spins = 8; //speed

var fixSegments;
var getData = async () => {
  let response = await fetch(
    "https://6540e47345bedb25bfc2d34b.mockapi.io/react-lab-todos/users/2"
  );
  let data = await response.json();
  return data.foods;
};

async function fetchDataAndContinue(callback) {
  try {
    fixSegments = await getData();
    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error("Đã có lỗi khi tải dữ liệu:", error);
  }
}
fetchDataAndContinue(() => {
  console.log(fixSegments);
  let segments = fixSegments;
  let theWheel = new Winwheel({
    numSegments: segments.length,
    outerRadius: 212,
    textFontSize: 20,
    rotationAngle: 0,
    segments: segments,
    animation: {
      type: "spinToStop",
      duration: duration,
      spins: spins,
      callbackSound: playSound,
      soundTrigger: "pin",
      callbackFinished: alertPrize,
    },
    pins: {
      number: 32,
    },
  });

  let wheelSpinning = false;

  let audio = new Audio("sound/tick.mp3");
  function playSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  //Hiển thị các nút vòng quay
  function statusButton(status) {
    if (status == 1) {
      //trước khi quay
      document.getElementById("spin_start").removeAttribute("disabled");
    } else if (status == 2) {
      //đang quay
      document.getElementById("spin_start").setAttribute("disabled", false);
    } else {
      alert("Các giá trị của status: 1, 2, 3");
    }
  }
  statusButton(1);

  //startSpin
  document.getElementById("spin_start").addEventListener("click", startSpin);
  function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
      //CSS hiển thị button
      statusButton(2);

      //Hàm bắt đầu quay
      theWheel.startAnimation();

      //Khóa vòng quay
      wheelSpinning = true;
    }
  }

  function alertPrize(indicatedSegment) {
    document.getElementById("resultText").innerText = indicatedSegment.text;
    var resultModal = new bootstrap.Modal(
      document.getElementById("resultModal")
    );
    resultModal.show();
  }

  var insertModal = new bootstrap.Modal(document.getElementById("insertModal"));
  var errorAlert = document.getElementById("errorAlert");
  var errorTitle = document.getElementById("errorTitle");
  document
    .getElementById("insertBtn")
    .addEventListener("click", openInsertModel);
  function openInsertModel() {
    errorAlert.hidden = true;
    insertModal.show();
    document.getElementById("errorAlert").classList.add("hide");
    let prizeInput = document.getElementById("inputValues");
    let values = segments.map((segment) => segment.text);
    prizeInput.value = values;
  }

  document
    .getElementById("insertPrizes")
    .addEventListener("click", insertPrizes);
  function insertPrizes() {
    // set new segments to the wheel based on the input fields in the modal form.
    // The existing segments are cleared first.
    let newValue = document.getElementById("inputValues").value;
    theWheel.clearCanvas();
    let newSegments = [];
    let prizeInput = newValue.trim().split(",");
    let prizeInputLength = prizeInput.length;
    // remove empty items
    if (prizeInputLength == 1) {
      errorAlert.hidden = false;
      errorTitle.innerText = "Nhập vài món đi bạn ơi";
      return;
    }
    if (prizeInputLength < 2) {
      errorAlert.hidden = false;
      errorTitle.innerText = "Có một món sao mà quay được";
      return;
    }

    // let fillStyles = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
    let fillStyles = [
      "#eae56f", "#89f26e", "#7de6ef", "#e7706f",
      "#66a3ff", "#ffcc66", "#cc99ff", "#99ffcc",
      "#ff6666", "#66ff66", "#6666ff", "#ffcc99"
    ];
    
    let fillStyles2 = ["#e51b1f","#ec681b","#f49817","#fecc16","#f1e611","#71b62b","#189938","#36bac0","#2064ae","#5d2684","#892e88","#b9308a"];
    for (let i = 0; i < prizeInputLength; i++) {
      console.log(prizeInput[i]);
      if (prizeInput[i].trim() != "" && prizeInput[i].trim() != " ") {
        let randomFillStyle = fillStyles[i % fillStyles.length];
        console.log(randomFillStyle);
        newSegments.push({
          fillStyle: randomFillStyle,
          textFillStyle: "black",
          text: prizeInput[i],
          textFontFamily: "Times New Roman",
          textFontSize: 20,
        });
      }
    }

    //send new segments to server and update fixSegments
    fetch(
      "https://6540e47345bedb25bfc2d34b.mockapi.io/react-lab-todos/users/2",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foods: newSegments }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        fixSegments = data.foods;
      });

    theWheel = new Winwheel({
      numSegments: newSegments.length,
      outerRadius: 212,
      textFontSize: 18,
      segments: newSegments,
      animation: {
        type: "spinToStop",
        duration: duration,
        spins: spins,
        callbackSound: playSound,
        soundTrigger: "pin",
        callbackFinished: alertPrize,
      },
      pins: {
        number: 32,
      },
    });

    insertModal.hide();
    segments = newSegments;
    resetWheel();
  }

  //resetWheel
  // document.getElemenstByClass("spin_reset").addEventListener("click", resetWheel);
  document
    .getElementsByClassName("spin_reset")[0]
    .addEventListener("click", resetWheel);
  document
    .getElementsByClassName("spin_reset")[1]
    .addEventListener("click", resetWheel);

  function resetWheel() {
    statusButton(1);
    theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
    theWheel.draw(); // Call draw to render changes to the wheel.
    wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
  }
});

fetchDataAndContinue();
