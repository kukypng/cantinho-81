import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchBar from "./SearchBar";
const MobileSearch = () => {
  return <Popover>
      <PopoverTrigger asChild>
        
      </PopoverTrigger>
      <PopoverContent className="p-4 w-[90vw] max-w-md border-2 border-store-pink/20 shadow-xl" side="bottom" align="end">
        <div className="space-y-3">
          <h4 className="font-semibold text-store-pink">Buscar produtos</h4>
          <SearchBar />
        </div>
      </PopoverContent>
    </Popover>;
};
export default MobileSearch;