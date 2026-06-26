import { zIndex } from "@/styles/zIndex";

export const MODAL_Z_INDEX = zIndex.modal;

export const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: MODAL_Z_INDEX,
  padding: 20,
};
