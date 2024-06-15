import { ConnectKitButton } from "connectkit";

import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b border-mainBg transition-all">
      <div className="flex items-center justify-between max-w-[85rem] w-full mx-auto py-5 px-3">
        <div className="flex items-center gap-16"></div>

        <div className="flex items-center gap-2">
          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => {
              return (
                <Button
                  onClick={show}
                  className="rounded-xl font-medium uppercase transition-all w-36 bg-[#9b923b] hover:bg-[#a99f44] text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
                >
                  {isConnected
                    ? `${address?.slice(0, 5)}...${address?.slice(-5)}`
                    : "connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
