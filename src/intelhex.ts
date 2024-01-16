/**
 * Minimal Intel HEX loader
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */

import { closeSync, openSync, readSync } from "fs";
import { RP2040 } from "rp2040js";
import { decodeBlock } from "uf2";

export function loadHex(source: string, target: Uint8Array, baseAddress: number = 0) {
  let highAddressBytes = 0;
  for (const line of source.split('\n')) {
    if (line[0] === ':' && line.substr(7, 2) === '04') {
      highAddressBytes = parseInt(line.substr(9, 4), 16);
    }
    if (line[0] === ':' && line.substr(7, 2) === '00') {
      const bytes = parseInt(line.substr(1, 2), 16);
      const addr = ((highAddressBytes << 16) | parseInt(line.substr(3, 4), 16)) - baseAddress;
      for (let i = 0; i < bytes; i++) {
        target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
      }
    }
  }
}

export function loadUF2(filename : string, rp2040: RP2040) {
  const file = openSync(filename, 'r');
  const buffer = new Uint8Array(512);
  while (readSync(file, buffer) === buffer.length) {
    const block = decodeBlock(buffer);
    const { flashAddress, payload } = block;
    rp2040.flash.set(payload, flashAddress - 0x10000000);
  }
  closeSync(file);
};