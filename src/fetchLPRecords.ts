import { BigNumber, constants, Contract } from "ethers";
import { IERC20 } from "@sushiswap/contracts/types/IERC20";
import { abi } from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { provider } from "./ethers";

export interface LPRecord {
  negative: boolean;
  address: string;
  amount: BigNumber;
  blockNumber: number;
}

export type LPRecords = Record<string, LPRecord[]>;

const fetchLPRecords = async (lpToken: string): Promise<LPRecords> => {
  const records: LPRecords = {};

  const token = new Contract(lpToken, abi, provider) as IERC20;
  (await token.queryFilter(token.filters.Transfer())).forEach((event) => {
    const { to, from, value } = event.args;
    if (to == constants.AddressZero && from == constants.AddressZero) {
      // do nothing
    } else if (to == constants.AddressZero) {
      addRecord(records, from, true, value, event.blockNumber);
    } else if (from == constants.AddressZero) {
      addRecord(records, to, false, value, event.blockNumber);
    } else {
      addRecord(records, from, true, value, event.blockNumber);
      addRecord(records, to, false, value, event.blockNumber);
    }
  });

  return records;
};

const addRecord = (
  records: LPRecords,
  address: string,
  negative: boolean,
  amount: BigNumber,
  blockNumber: number
) => {
  if (!records[address]) records[address] = [];
  records[address].push({
    address: address,
    negative,
    amount,
    blockNumber,
  });
};

export default fetchLPRecords;
