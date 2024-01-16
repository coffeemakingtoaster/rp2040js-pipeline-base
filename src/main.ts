
import { RP2040, ConsoleLogger, LogLevel, USBCDC, RPUSBController  } from "rp2040js";
import { bootromB1 } from "./bootrom";
import { loadHex } from "./intelhex";
import fs from "fs";

const rp2040 = new RP2040()

rp2040.usbCtrl.onUSBEnabled = () =>{
    console.log("enabled")
}

const hex = fs.readFileSync('main.hex', 'utf-8');

rp2040.loadBootrom(bootromB1);

loadHex(hex, rp2040.flash, 0x10000000);

rp2040.logger = new ConsoleLogger(LogLevel.Error);

// Create a USB CDC
const cdc = new USBCDC(rp2040.usbCtrl)

cdc.onSerialData = (value) => {
    process.stdout.write(value);
};

rp2040.core.PC = 0x10000000; 

console.log("Executing test application on simulated rp2040...")

rp2040.execute()