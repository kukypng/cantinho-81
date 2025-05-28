
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchBar from "./SearchBar";

const MobileSearch = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-store-pink hover:bg-gray-100 btn-pop p-1.5">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-[90vw]" side="bottom" align="end">
        <SearchBar />
      </PopoverContent>
    </Popover>
  );
};

export default MobileSearch;
