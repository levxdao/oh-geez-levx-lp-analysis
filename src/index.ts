import fetchLPRecords from "./fetchLPRecords";
import processLPRecords from "./processLPRecords";

const main = async () => {
  const block = 14699494;
  const blacklist = [
    "0x5b8C253517b6Bd003369173109693B01cb6841B5", // levx.eth
    "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd", // MasterChef
    "0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50", // SushiMaker
    "0x854B54c39C4d8C6c781Ad6F7b036338d47F163F8", // OH-GEEZ
    "0xdE0C1dC7f2b67705Cca50039418715F9C7F8D53B", // LEVX
  ];
  const ohGeezRecords = await fetchLPRecords(
    "0x854b54c39c4d8c6c781ad6f7b036338d47f163f8"
  );
  processLPRecords(ohGeezRecords, "oh-geez", block, blacklist);
  const levxRecords = await fetchLPRecords(
    "0xde0c1dc7f2b67705cca50039418715f9c7f8d53b"
  );
  processLPRecords(levxRecords, "levx", block, blacklist);
};

main().catch(console.error);
