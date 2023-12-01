//Thông số vòng quay
let duration = 5; //Thời gian kết thúc vòng quay
let spins = 8; //Quay nhanh hay chậm 3, 8, 15
let fixSegments = [
  {
    fillStyle: "#eae56f",
    text: "Cơm Sườn",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#89f26e",
    text: "Hủ Tiếu",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#7de6ef",
    text: "Cháo Ếch",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#e7706f",
    text: "Hột Vịt Lộn",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#eae56f",
    text: "Mỳ Cay",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#89f26e",
    text: "Lẩu Bò",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#7de6ef",
    text: "Lẩu Gà",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
  {
    fillStyle: "#e7706f",
    text: "Bò Né",
    textFontFamily: "Times New Roman",
    textFontSize: 20,
  },
];

let segments = fixSegments;
let theWheel = new Winwheel({
  numSegments: 8, // Chia 8 phần bằng nhau
  outerRadius: 212, // Đặt bán kính vòng quay
  textFontSize: 18, // Đặt kích thước chữ
  rotationAngle: 0, // Đặt góc vòng quay từ 0 đến 360 độ.
  // Các thành phần bao gồm màu sắc và văn bản.
  segments: segments,
  animation: {
    type: "spinToStop",
    duration: duration,
    spins: spins,
    callbackSound: playSound, //Hàm gọi âm thanh khi quay
    soundTrigger: "pin", //Chỉ định chân là để kích hoạt âm thanh
    callbackFinished: alertPrize, //Hàm hiển thị kết quả trúng giải thưởng
  },
  pins: {
    number: 32, //Số lượng chân. Chia đều xung quanh vòng quay.
  },
});

//Kiểm tra vòng quay
let wheelSpinning = false;

//Tạo âm thanh và tải tập tin tick.mp3.
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
    document.getElementById("spin_reset").classList.add("hide");
  } else if (status == 2) {
    //đang quay
    document.getElementById("spin_start").setAttribute("disabled", false);
    document.getElementById("spin_reset").classList.add("hide");
  } else if (status == 3) {
    //kết quả
    document.getElementById("spin_reset").classList.remove("hide");
  } else {
    alert("Các giá trị của status: 1, 2, 3");
  }
}
statusButton(1);

//startSpin
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
  var resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
  resultModal.show();
  statusButton(3);
}

var insertModal = new bootstrap.Modal(document.getElementById("insertModal"));
var errorAlert = document.getElementById("errorAlert");
var errorTitle = document.getElementById("errorTitle");
function openInsertModel() {
    errorAlert.hidden = true;
  insertModal.show();
  document.getElementById("errorAlert").classList.add("hide");
  let prizeInput = document.getElementById("inputValues");
  let values = segments.map((segment) => segment.text);
  prizeInput.value = values;
}

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

  let fillStyles = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  for (let i = 0; i < prizeInputLength; i++) {
    console.log(prizeInput[i]);
    if (prizeInput[i].trim() != "" && prizeInput[i].trim() != " ") {
      let randomFillStyle = fillStyles[i % 4];
      console.log(randomFillStyle);
      newSegments.push({
        fillStyle: randomFillStyle,
        text: prizeInput[i],
        textFontFamily: "Times New Roman",
        textFontSize: 20,
      });
    }
  }

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
function resetWheel() {
  statusButton(1);
  theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
  theWheel.draw(); // Call draw to render changes to the wheel.
  wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
}
