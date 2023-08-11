import { SSBasicRow, SSModal } from "@easyblocks/design-system";
import { Audience } from "@easyblocks/core";
import React, { useState } from "react";

interface AudienceModalProps {
  allAudiences?: Audience[];
  onClose: () => void;
  onAudienceChange: (value: string) => void;
}

function AudienceModal({
  allAudiences = [],
  onClose,
  onAudienceChange = () => {},
}: AudienceModalProps) {
  const [query, setQuery] = useState<string | null>(null);

  const filteredAudiences = allAudiences.filter(({ name }) =>
    query ? name.includes(query) : true
  );

  return (
    <SSModal
      mode={"center-small"}
      isOpen={true}
      onRequestClose={() => {
        onClose();
      }}
      headerLine={true}
      searchProps={{
        value: query,
        placeholder: "Search...",
        onChange: (e: any) => {
          setQuery(e.target.value);
        },
      }}
    >
      {filteredAudiences.map(({ name, id }) => (
        <SSBasicRow
          key={id}
          title={name}
          onClick={() => {
            onAudienceChange(id);
          }}
        />
      ))}
    </SSModal>
  );
}

export { AudienceModal };
