import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { ethers } from "ethers";
import { privateKeyToAccount } from "viem/accounts";

// Make sure private key is a valid 32-byte hex string
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";

// Ensure private key is properly formatted
const formatPrivateKey = (key: string): `0x${string}` => {
  // Remove '0x' prefix if present and ensure it's 64 characters long
  const cleanKey = key.replace('0x', '').padStart(64, '0');
  return `0x${cleanKey}` as `0x${string}`;
};

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.scrollSepolia,
  account: privateKeyToAccount(formatPrivateKey(PRIVATE_KEY)),
});

export async function createNotaryAttestation(requestorAddress: string, price: bigint, projectID: number) {

  // Convert price to number
  // const priceNumber = parseFloat(price);

  try {
    console.log("Creating attestation with params:", {
      requestorAddress,
      price,
      projectID
    });

    // Convert price to integer by multiplying by 1000 (3 decimal places)
    // const priceInMilliUnits = Math.round(price * 1000);
    // cons 
    
    // Encode the data properly
    const encodedData = {
      requestorAddress: requestorAddress as `0x${string}`,
      price: price,
      projectID: BigInt(projectID)
    };

    console.log("Encoded data:", encodedData);
    
    const res = await client.createAttestation({
      schemaId: "0x65", // Make sure this matches your deployed schema ID
      data: encodedData,
      indexingValue: projectID.toString()
    });

    console.log("Attestation created successfully:", res);
    return res;
  }
  catch (error) {
    console.error('Attestation error:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}