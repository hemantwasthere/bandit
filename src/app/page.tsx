"use client";

import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";

export default function Home() {
  const [transferAmount, setTransferAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const { address, isConnected } = useAccount();

  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  const { data } = useBalance({
    address: address,
  });
  const accountBalance = data?.formatted;

  const handleTransfer = async () => {
    if (!receiverAddress) {
      return toast.error("Please enter a receiver address");
    }

    if (!transferAmount) {
      return toast.error("Please enter an amount to transfer");
    }

    sendTransaction({
      to: `0x${
        receiverAddress.includes("0x")
          ? receiverAddress.slice(2)
          : receiverAddress
      }`,
      value: parseEther(transferAmount),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #ffdead 0%, #e1d77d 100%)",
      }}
    >
      <Navbar />

      <div className="h-[calc(100vh-82px)] flex flex-col mx-auto justify-center items-center px-3 sm:px-0 overflow-hidden">
        <div className="fixed -right-72 top-[80px] opacity-60">
          <div className="relative w-[695px] h-[1024px]">
            <Image src="/widget.svg" fill alt="eth" />
          </div>
        </div>

        <div className="shadow-xl rounded-xl border-2 border-mainBg w-full max-w-xl p-3 bg-[#fadfb5] z-40">
          <div className="rounded-tl-xl rounded-tr-xl transition-all shadow-sm relative border border-mainBg p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">AVAILABLE TO TRANSFER</p>
              <p className="font-bold">{isConnected ? accountBalance : 0.0}</p>
            </div>
          </div>

          <div className="border-x border-b border-mainBg p-4 w-full flex items-center gap-3">
            <Input
              value={receiverAddress ? receiverAddress : ""}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-lg focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium bg-[#fadfb5]"
              placeholder="Recipient Address"
              type="text"
              disabled={isPending}
            />
          </div>

          <div className="border-x border-b border-mainBg p-4 w-full flex items-center gap-3 rounded-bl-xl rounded-br-xl">
            <Input
              value={transferAmount ?? ""}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium bg-[#fadfb5]"
              placeholder="0.0"
              type="number"
              disabled={isPending}
            />

            <button
              disabled={isPending}
              onClick={() => {
                if (!isConnected) {
                  toast.error("Please connect your wallet first");
                } else setTransferAmount(accountBalance ? accountBalance : "");
              }}
              className="bg-[#9b923b] hover:bg-[#a99f44] text-white/90 px-2 py-1 w-fit text-xs font-medium cursor-pointer transition-all rounded-md ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              MAX
            </button>
          </div>

          {isConnected ? (
            <Button
              disabled={isPending}
              onClick={handleTransfer}
              className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 transition-all uppercase ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
            >
              Transfer
            </Button>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <Button
                    onClick={show}
                    className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 uppercase transition-all ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
                  >
                    Connect Wallet
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          )}

          {hash && (
            <div className="mt-5 w-full text-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 uppercase">Transaction Hash</p>
                <div className="flex items-center justify-center gap-2">
                  {hash.slice(0, 6) + "..." + hash.slice(hash.length - 4)}
                  <CopyIcon
                    className="h-3 w-3 cursor-pointer border-[#9A913B]"
                    onClick={() => {
                      navigator.clipboard.writeText(hash);
                      toast.success("Copied to clipboard");
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 uppercase">Status</p>
                <p>
                  {isConfirming && "Waiting for confirmation..."}
                  {isConfirmed && "Transaction confirmed"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
