"use client";

import { Canvas } from "@easyblocks/react";
import { shopstoryConfig } from "@/app/shopstory/shopstory.config";
import { AcmeShopstoryProvider } from "@/app/shopstory/AcmeShopstoryProvider";
export default function ShopstoryCanvas() {
  return (
    <AcmeShopstoryProvider>
      <Canvas config={shopstoryConfig} />
    </AcmeShopstoryProvider>
  );
}
