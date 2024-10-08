const form = document.getElementById("imei-form");
form.classList.add("imei-form-container");

for (let i = 0; i < 50; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "imei[]";
  input.classList.add("imei-input");
  input.placeholder = `IMEI ${i + 1}`;
  form.appendChild(input);
}

function submitImeiNums() {
  const imeiInputs = document.querySelectorAll('input[name="imei[]"]');
  const imeiNums = [];
  let isValid = true;
  let errorMessage = "";

  imeiInputs.forEach((input) => {
    const value = input.value.trim();

    if (value.length === 15) {
      imeiNums.push(value);
    }
  });

  if (imeiNums.length === 0) {
    errorMessage = "At least one valid IMEI number is required.";
    isValid = false;
  }

  if (!isValid) {
    document.getElementById("error").textContent = errorMessage;
    return;
  }

  document.getElementById("error").textContent = "";
  generateBarcodes(imeiNums);

  hideHeaderInputs();
}

function generateBarcodes(imeiNums) {
  const imeiContainer = document.querySelector(".IMEI");
  imeiContainer.innerHTML = "";

  imeiNums.forEach((imei) => {
    const imeiDiv = document.createElement("div");
    imeiDiv.classList.add("imei-container");

    const barcodeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    imeiDiv.appendChild(barcodeSvg);

    imeiContainer.appendChild(imeiDiv);

    JsBarcode(barcodeSvg, imei, {
      format: "CODE128",
      displayValue: true,
      width: 2,
      height: 24,
    });
  });

  updateLabels();
  generatePdf();
}

function updateLabels() {
  const sku = document.getElementById("sku-input").value.trim();
  const orderNum = document.getElementById("orderNum-input").value.trim();
  const qty = document.getElementById("qty-input").value.trim();
  const caseId = document.getElementById("caseId-input").value.trim();
  const deviceModel = document.getElementById("device-model").value.trim();
  const swVersion = document.getElementById("sw-version").value.trim();

  const barcodeElements = {
    sku: document.getElementById("sku"),
    orderNum: document.getElementById("orderNum"),
    qty: document.getElementById("qty"),
    caseId: document.getElementById("caseId"),
  };

  if (deviceModel) {
    const deviceHeader = document.querySelector(".device");
    deviceHeader.firstChild.textContent = `Device Model #: ${deviceModel}`;
  }

  if (swVersion) {
    const swVersionHeader = document.querySelector(".software");
    swVersionHeader.firstChild.textContent = `SW VERSION: ${swVersion}`;
  }

  if (sku) {
    const skuLabel = document.querySelector(".skuNum");
    skuLabel.firstChild.textContent = `AT&T SKU: ${sku}`;
    const skuContainer = barcodeElements.sku;
    skuContainer.innerHTML = "";
    const barcodeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    skuContainer.appendChild(barcodeSvg);

    JsBarcode(barcodeSvg, sku, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: skuContainer.clientHeight,
    });
  }

  if (orderNum) {
    const orderNumLabel = document.querySelector(".order");
    orderNumLabel.firstChild.textContent = `ORDER #: ${orderNum}`;
    const orderNumContainer = barcodeElements.orderNum;
    orderNumContainer.innerHTML = "";
    const barcodeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    orderNumContainer.appendChild(barcodeSvg);

    JsBarcode(barcodeSvg, orderNum, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: orderNumContainer.clientHeight,
    });
  }

  if (qty) {
    const qtyLabel = document.querySelector(".carton");
    qtyLabel.firstChild.textContent = `CARTON QTY: ${qty}`;
    const qtyContainer = barcodeElements.qty;
    qtyContainer.innerHTML = "";
    const barcodeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    qtyContainer.appendChild(barcodeSvg);

    JsBarcode(barcodeSvg, qty, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: 24,
    });
  }

  if (caseId) {
    const caseIdLabel = document.querySelector(".case");
    caseIdLabel.firstChild.textContent = `CASE ID: ${caseId}`;
    const caseIdContainer = barcodeElements.caseId;
    caseIdContainer.innerHTML = "";
    const barcodeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    caseIdContainer.appendChild(barcodeSvg);

    JsBarcode(barcodeSvg, caseId, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: 75
    });
  }
}

function hideHeaderInputs() {
  const headerInputs = document.querySelectorAll(
    "#sku-input, #orderNum-input, #qty-input, #caseId-input, #device-model, #sw-version"
  );
  headerInputs.forEach((input) => {
    input.style.display = "none";
  });
}

function generatePdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1056, 816],
  });

  document
    .querySelectorAll(
      "#sku-input, #orderNum-input, #qty-input, #caseId-input, #device-model, #sw-version"
    )
    .forEach((input) => input.classList.add("pdf-hide"));

  // Target the main container to convert it to PDF
  const mainContainer = document.querySelector(".main-container");

  html2canvas(mainContainer, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 1056; // PDF width in px
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    doc.save("labels.pdf");
  });
}
