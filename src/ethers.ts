import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const provider = new ethers.providers.AlchemyProvider(
  1,
  process.env.ALCHEMY_API_KEY
);
