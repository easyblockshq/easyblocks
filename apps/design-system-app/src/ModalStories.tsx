import { useState } from "react";
import {
  ButtonPrimary,
  ButtonSecondary,
  Modal,
  Typography,
} from "@easyblocks/design-system";

function Modal1() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ButtonPrimary
        onClick={() => {
          setOpen(true);
        }}
      >
        Open modal small
      </ButtonPrimary>
      <Modal
        isOpen={open}
        mode={"center-small"}
        onRequestClose={() => setOpen(false)}
        headerLine={true}
        title={"My modal"}
      >
        <div style={{ marginTop: "8px", marginBottom: "24px" }}>
          <Typography variant={"body"}>
            Are you sure you want to remove this item?
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <ButtonSecondary>Cancel</ButtonSecondary>
          <ButtonPrimary>Delete</ButtonPrimary>
        </div>
      </Modal>
    </div>
  );
}

function ModalNoPadding() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ButtonPrimary
        onClick={() => {
          setOpen(true);
        }}
      >
        Open modal small (no padding)
      </ButtonPrimary>
      <Modal
        isOpen={open}
        mode={"center-small"}
        onRequestClose={() => setOpen(false)}
        headerLine={true}
        title={"My modal"}
        noPadding={true}
      >
        <div style={{ background: "lightgreen" }}>
          <Typography variant={"body"}>Some text blah blah blah</Typography>
        </div>
      </Modal>
    </div>
  );
}

function Modal2() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ButtonPrimary
        onClick={() => {
          setOpen(true);
        }}
      >
        Huge modal (inline modal)
      </ButtonPrimary>
      <Modal
        isOpen={open}
        mode={"center-huge"}
        onRequestClose={() => setOpen(false)}
        headerLine={true}
        title={"My modal"}
      >
        <Typography variant={"body"}>Huge</Typography>
        <br />
        <Modal1 />
      </Modal>
    </div>
  );
}

export function ModalStories() {
  return (
    <div>
      <Typography variant={"label"}>Modals</Typography>
      <br />
      <Modal1 />
      <br />
      <ModalNoPadding />
      <br />
      <Modal2 />
    </div>
  );
}
