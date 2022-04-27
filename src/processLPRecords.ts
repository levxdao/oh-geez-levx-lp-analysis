import { LPRecords } from "./fetchLPRecords";
import { BigNumber, constants, utils } from "ethers";
import fs from "fs";

const processLPRecords = (
  lpRecords: LPRecords,
  tag: string,
  currentBlockNumber: number,
  blacklist: string[] = []
) => {
  const amounts: Record<string, BigNumber> = {};
  let content = "address,sign,amount,block_number\n";
  for (const address of Object.keys(lpRecords)) {
    if (blacklist.includes(address)) continue;
    const records = lpRecords[address];
    for (const record of records) {
      const { negative, amount, blockNumber } = record;
      content += `${address},${negative ? "-1" : "+1"},${utils.formatEther(
        amount
      )},${blockNumber}\n`;

      const elapsed = currentBlockNumber - blockNumber;
      if (!amounts[address]) amounts[address] = constants.Zero;
      if (negative) {
        amounts[address] = amounts[address].sub(amount.mul(elapsed));
      } else {
        amounts[address] = amounts[address].add(amount.mul(elapsed));
      }
    }
  }

  let path = "data/" + tag + "-records.csv";
  fs.closeSync(fs.openSync(path, "a"));
  fs.writeFileSync(path, content, "utf-8");

  // Write weighted amounts
  content = `address,weighted_amount(${currentBlockNumber})\n`;
  for (const address of Object.keys(amounts)) {
    if (blacklist.includes(address)) continue;
    content += `${address},${utils.formatEther(amounts[address])}\n`;
  }

  path = "data/" + tag + ".csv";
  fs.closeSync(fs.openSync(path, "a"));
  fs.writeFileSync(path, content, "utf-8");
};

export default processLPRecords;
