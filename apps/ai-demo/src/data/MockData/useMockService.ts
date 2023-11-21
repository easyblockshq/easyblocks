import { useEffect, useState } from "react";
import { MockDataService } from "@/data/MockData/MockDataService";

export function useMockService() {
  const [service, setService] = useState<MockDataService | null>(null);

  useEffect(() => {
    setService(new MockDataService());
  }, []);

  return service;
}
