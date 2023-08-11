import {
  SSBasicRow,
  SSButtonSecondary,
  SSColors,
  SSFonts,
  SSModal,
} from "@easyblocks/design-system";
import { Audience } from "@easyblocks/core";
import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  border-radius: 0.5rem;
  margin: 0 1rem 0 0;
`;

const Picked = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0 0.5rem;
`;

const Chip = styled.div`
  ${SSFonts.body};
  color: ${SSColors.blue70};
  background: ${SSColors.blue20};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  &:hover {
    text-decoration: line-through;
    cursor: pointer;
  }
`;

interface AudiencePickerProps {
  allAudiences?: Audience[];
  audiences?: string[];
  onAudienceChange: (value: string) => void;
}

function AudiencePicker({
  allAudiences = [],
  audiences = [],
  onAudienceChange = () => {},
}: AudiencePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (allAudiences.length === 0) {
    return null;
  }

  const isPicked = (id: string) => audiences.includes(id);
  const picked = allAudiences.filter(({ id }) => isPicked(id));

  const filteredAudiences = allAudiences.filter(({ name }) =>
    query ? name.includes(query) : true
  );

  return (
    <Wrapper>
      <SSButtonSecondary
        onClick={() => {
          setOpen(true);
        }}
      >
        Audience
      </SSButtonSecondary>
      {picked.length > 0 && (
        <Picked>
          {picked.map(({ name, id }) => (
            <Chip onClick={() => onAudienceChange(id)}>{name}</Chip>
          ))}
        </Picked>
      )}
      <SSModal
        mode={"center-small"}
        isOpen={open}
        onRequestClose={() => {
          setOpen(false);
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
            description={isPicked(id) ? "Remove" : ""}
            onClick={() => {
              onAudienceChange(id);
            }}
          />
        ))}
      </SSModal>
    </Wrapper>
  );
}

export { AudiencePicker };
