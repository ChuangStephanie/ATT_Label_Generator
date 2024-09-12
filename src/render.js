// Generate 50 sample IMEI numbers (you can replace this with actual data)
const imeiNumbers = Array.from({ length: 50 }, (_, i) => 100000000000000 + i);
const imeiContainer = document.querySelector(".IMEI");

// Generate barcode and IMEI text for each number
imeiNumbers.forEach((imei) => {
  const imeiDiv = document.createElement("div");
  imeiDiv.classList.add("imei-container");

  // Create the SVG element for the barcode
  const barcodeSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  // Append barcode and text to the container
  imeiDiv.appendChild(barcodeSvg);

  // Append the container to the main IMEI div
  imeiContainer.appendChild(imeiDiv);

  // Generate Code-128 barcode using JsBarcode
  JsBarcode(barcodeSvg, imei, {
    format: "CODE128",
    displayValue: true,
    width: 2,
    height: 24,
  });
});
