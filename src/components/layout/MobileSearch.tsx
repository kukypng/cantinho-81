import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchBar from "./SearchBar";
const MobileSearch = () => {
  return <Popover>
      <PopoverTrigger asChild>
        
      </PopoverTrigger>
      <PopoverContent className="p-3 w-[90vw]" side="bottom" align="end">
        <SearchBar />
      </PopoverContent>
    </Popover>;
};
export default MobileSearch;